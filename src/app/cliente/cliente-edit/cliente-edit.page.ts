import { Component, OnInit } from '@angular/core';
import { collection, addDoc, updateDoc, getDoc, Firestore, doc, } from '@angular/fire/firestore';
import { Storage, StorageError, UploadTaskSnapshot, getDownloadURL, ref, uploadBytesResumable, deleteObject } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-cliente-edit',
  templateUrl: './cliente-edit.page.html',
  styleUrls: ['./cliente-edit.page.scss'],
})
export class ClienteEditPage implements OnInit {



  id: any;

  cliente: any = [];
  avatar: string = '';
  //private storage: Storage = inject(Storage);
  constructor(private readonly firestore: Firestore,
    private route: ActivatedRoute,
    private rt: Router,
    private storage: Storage
  ) { }

  ngOnInit() {
    // this.incluirCliente();
    //this.editarCliente("2BpFVjd1yuhQwrWbRrk2");
    this.route.params.subscribe((params: any) => {
      //console.log('params', params);
      this.id = params.id;
      //console.log('id', this.id);
      if (this.id) {
        this.obtenerCliente(this.id);
      }

    });
  }

  incluirCliente = () => {
    console.log('aqui incluir en firebase');
    let clienteRef = collection(this.firestore, 'cliente');

    addDoc(
      clienteRef,
      {
        documento: this.cliente.documento,
        nombre: this.cliente.nombre,
        apellido: this.cliente.apellido,
        salario: (this.cliente.salario)?(this.cliente.salario):0,
        nacimiento: (this.cliente.nacimiento)?(new Date(this.cliente.nacimiento)):new Date(),
        estado: (this.cliente.estado)?(this.cliente.estado):false,
      }

    ).then(doc => {
      console.log('registro incluido');
      this.volver();

    }
    ).catch((error) => {
      console.error("Error: ", error);
    });
  }

  editarCliente = (id: string) => {
    console.log('aqui editar en firebase');
    const document = doc(this.firestore, 'cliente', this.id);

    updateDoc(
      document,
      {
        documento: this.cliente.documento,
        nombre: this.cliente.nombre,
        apellido: this.cliente.apellido,
        salario: (this.cliente.salario)?(this.cliente.salario):0,
        nacimiento: (this.cliente.nacimiento)?(new Date(this.cliente.nacimiento)):new Date(),
        estado: (this.cliente.estado)?(this.cliente.estado):false,
      }

    ).then(doc => {
      console.log('registro editado');
      this.volver();

    }
    ).catch((error) => {
      console.error("Error: ", error);
    });
  }

  obtenerCliente = (id: string) => {

    const document = doc(this.firestore, 'cliente', id);

    getDoc(document).then(doc => {
      console.log('registro a editar', doc.data());
      if (doc.data()) {
        this.cliente = doc.data();
        const timestamp = this.cliente.nacimiento; // Asume que 'fecha' es el campo Timestamp
        this.cliente.nacimiento = timestamp.toDate().toISOString(); // Convierte a ISO 8601
        if (this.cliente.avatar) {
          this.obtenerAvatarCliente();
        }
      } else {
        this.cliente = {};
      }


    });
  }

  volver = () => {
    this.rt.navigate(['/cliente-list']);


  }

  accion = (id: string) => {
    if (this.salarioValido()) {
      if (this.id) {
        //console.log("modificar");
        this.editarCliente(this.id);

      } else {
        //console.log("guardar");
        this.incluirCliente();

      }
      this.volver();
    }

  }
  uploadFile = (input: HTMLInputElement) => {
    if (!input.files) return

    const files: FileList = input.files;

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        console.log(file, file.name);
        const storageRef = ref(this.storage, `avatars/cliente/${this.id}`);

        uploadBytesResumable(storageRef, file).on(
          'state_changed',
          this.onUploadChange,
          this.onUploadError,
          this.onUploadComplete,
        );
      }
    }
  }

  onUploadChange = (response: UploadTaskSnapshot) => {
    console.log('onUploadChange', response);
  }

  onUploadError = (error: StorageError) => {
    console.log('onUploadError', error);
  }

  onUploadComplete = () => {
    console.log('upload completo');
    this.editarAvatar();
    this.obtenerAvatarCliente();
  }

  editarAvatar = () => {
    const document = doc(this.firestore, "cliente", this.id);
    updateDoc(document, {
      avatar: 'avatars/cliente/' + this.id
    }).then(doc => {
      console.log("Avatar Editado");
    });
  }

  obtenerAvatarCliente = () => {
    const storageRef = ref(this.storage, `avatars/cliente/${this.id}`);
    getDownloadURL(storageRef).then(doc => {
      this.avatar = doc;
    });
  }

  eliminarAvatar = () => {
    const avatarRef = ref(this.storage, `avatars/cliente/${this.id}`);

    deleteObject(avatarRef).then(() => {
      console.log('Avatar eliminado exitosamente');
      this.actualizarDocumentoClienteSinAvatar();
    }).catch((error) => {
      console.error('Error al eliminar el avatar: ', error);
    });
  }

  actualizarDocumentoClienteSinAvatar = () => {
    const document = doc(this.firestore, "cliente", this.id);
    updateDoc(document, {
      avatar: ''
    }).then(() => {
      console.log("Referencia del avatar eliminada del documento del cliente");
      this.avatar = ''; // Asegúrate de actualizar también la variable local si es necesario.
    }).catch((error) => {
      console.error("Error al actualizar el documento del cliente: ", error);
    });
  }
salarioValido() {
  const salarioMinimo = 2600000;
  if (this.cliente.salario < salarioMinimo) {
    alert("salario no valido")
    return false;
  }
  return true;
  }

}