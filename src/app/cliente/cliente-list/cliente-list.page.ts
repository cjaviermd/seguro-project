import { Component, OnInit } from '@angular/core';
import { collection, Firestore, doc, deleteDoc, query, limit, getDocs, startAfter, orderBy, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.page.html',
  styleUrls: ['./cliente-list.page.scss'],
})
export class ClienteListPage implements OnInit {
  listaClientes: any[] = [];
  li = 20;
  stAt: any;
  hayMasDatos: boolean = true;  // Nuevo indicador
  lastVisible: any;
  isSearch: boolean = false;
  query = "";

  constructor(private readonly firestore: Firestore, private rt: Router) { }

  ngOnInit() {

    this.iniciar();
  }
  ionViewWillEnter() {
    this.iniciar();
  }

  iniciar() {
    console.log("ion will enter");
    this.listaClientes=new Array();
    this.lastVisible=null;
    this.listarClientes();
  }



  listarClientesSinFiltro = () => {
    const clientesRef = collection(this.firestore, 'cliente');

    let q = undefined;
    if (this.lastVisible) {
      q = query(clientesRef, limit(this.li), startAfter(this.lastVisible));
    } else {
      q = query(clientesRef, limit(this.li));
    }
    const querySnapshot = getDocs(q).then(re => {
      if (!re.empty) {
        this.lastVisible = re.docs[re.docs.length - 1];

        re.forEach(doc => {
          //console.log("queryyyy", doc.id, "data", doc.data());
          let cliente: any = doc.data();
          cliente.id = doc.id;
          this.listaClientes.push(cliente);
        });
      }
    });


  }

  listarClientes = () => {
    const clientesRef = collection(this.firestore, 'cliente');

    if ((this.query + "").length > 0) {
      let q = undefined;
      if (this.lastVisible) {
        q = query(clientesRef,
          where("nombre", ">=", this.query.toUpperCase()),
          where("nombre", "<=", this.query.toLowerCase() + '\uf8ff'),
          limit(this.li),
          startAfter(this.lastVisible));

      } else {
        q = query(clientesRef,
          where("nombre", ">=", this.query.toUpperCase()),
          where("nombre", "<=", this.query.toLowerCase() + '\uf8ff'),
          limit(this.li));
      }
      getDocs(q).then(re => {

        if (!re.empty) {
          let nuevoArray = new Array();
          //retirar lo que no corresonde
          for (let i = 0; i < re.docs.length; i++) {
            const doc: any = re.docs[i].data();
            if (doc.nombre.toUpperCase().
              startsWith(
                this.query.toUpperCase().charAt(0)//M
              )) {
              nuevoArray.push(re.docs[i]);

            }
          }
          this.lastVisible = re.docs[nuevoArray.length - 1];
          for (let i = 0; i < nuevoArray.length; i++) {
            const doc: any = nuevoArray[i];
            let cliente: any = doc.data();
            cliente.id = doc.id;
            this.listaClientes.push(cliente);
          }

        }
      });
    } else {
      this.listarClientesSinFiltro();
    }
  }


  clearSearch = () => {
    this.isSearch = false;
    this.query = "";

    this.listaClientes = new Array();
    this.lastVisible = null;
    this.listarClientes();
  }


  buscarSearch = (e: any) => {
    this.isSearch = false;
    this.query = e.target.value;

    this.listaClientes = new Array();
    this.lastVisible = null;
    this.listarClientes();
  }




  nuevo = () => {
    this.rt.navigate(['/cliente-edit']);
  }

  eliminarCliente = (id: string) => {
    console.log('Eliminando cliente en Firebase...');
    deleteDoc(doc(this.firestore, 'cliente', id)).then(() => {
      console.log('Registro eliminado');
      // this.volver();
      this.iniciar();
    }).catch((error) => {
      console.error("Error al eliminar el documento: ", error);
    });
  }
  clickSearch = () => {
    this.isSearch = true;
  }


  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    if (this.hayMasDatos) {
      this.listarClientes();
    }
    setTimeout(() => {
      ev.target.complete();
      if (!this.hayMasDatos) {
        ev.target.disabled = true;  // Deshabilitamos el ion-infinite-scroll si no hay más datos
      }
    }, 500);
  }
formatearFecha(timestamp: FirebaseTimestamp, locale: string = 'es-ES'): string {
  // Convertir el timestamp de Firebase a milisegundos
  const milisegundos = (timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000);

  // Crear un objeto Date con el valor en milisegundos
  const fecha = new Date(milisegundos);

  // Ajustar las opciones para el formato deseado
  const opciones: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  // Usar toLocaleDateString para obtener la fecha en el formato local y luego reemplazar los separadores según sea necesario
  const fechaFormateada = fecha.toLocaleDateString(locale, opciones);

  // Dependiendo del locale, es posible que necesites ajustar este paso. 
  // Esto asume que el separador es '/' para el formato 'es-ES'. Si tu locale utiliza otro separador, ajusta esto acordemente.
  return fechaFormateada; // Esto debería retornar la fecha en el formato 'dd/mm/yyyy'
  }

}