import { Component, OnInit } from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Product {
  name: string;
  price: number;
  qty: number;
}
class Invoice {
  customerName: string;
  address: string;
  email: string;
  date: Date;
  number: number;
  nif: string;
  telFax: string;
  cpMunProv: string;

  products: Product[] = [];
  additionalDetails: string;

  constructor() {
    // Initially one empty product row we will show
    this.products.push(new Product());
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  invoice = new Invoice();
  // async ngOnInit() {
  //   await this.generatePDF();
  // }

  async generatePDF(action = 'open') {
    const sumaTotal = this.invoice.products.reduce((sum, p) => sum + (p.qty * p.price), 0).toFixed(2);

    let docDefinition = {
      content: [

        // {
        //   // under NodeJS (or in case you use virtual file system provided by pdfmake)
        //   // you can also pass file names here
        //   image: await this.getBase64ImageFromURL("../../assets/image1.jpeg")
        // },
        {
          text: 'Factura',
          fontSize: 42,
          alignment: 'left',
          bold: true
          , margin: [0, 20]

        },
        {
          columns: [
            [
              {
                text: `Cliente: ${this.invoice.customerName || `Varios`}`,
              },
              { text: `Domicilio: ${this.invoice.address}` },
              { text: `N.I.F: ${this.invoice.nif}` },
              {
                text: `C.P./Municipio/Provincia ${this.invoice.cpMunProv}`
              },
              {
                text: `Telf:/Fax ${this.invoice.telFax}`
              }, {
                text: `Correo electrónico ${this.invoice.email}`
              }
            ],
            [
              {
                text: `FACTURA No: ${this.invoice.number}`,
              },
              {
                text: `Fecha: ${new Date(this.invoice.date).toLocaleDateString('en-GB')}`,
              },
              {
                text: `Nombre: Rosario Rodríguez Corrales`,
                bold: true
              },
              {
                text: `Domicilio: c / Las Cabezas de San Juan n 1, local 11`,
              },
              {
                text: `Provincia: 41701 Dos Hermanas(Sevilla)`,
              },
              {
                text: `C.I.F o N.I.F: 52668169 - D`,
              },
            ]
          ]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto'],
            body: [
              ['CANTIDAD', 'CONCEPTO', 'PRECIO', 'TOTAL'],
              ...this.invoice.products.map(p => ([p.qty, p.name, (p.price * 0.79).toFixed(2), (p.price * p.qty * 0.79).toFixed(2)])),
              [{}, {}, { text: 'BASE IMPONIBLE' }, (+sumaTotal * 0.79).toFixed(2)],
              [{}, {}, { text: 'IVA 21%' }, (+sumaTotal * 0.21).toFixed(2)],
              [{}, {}, { text: 'SUMA TOTAL' }, sumaTotal]
            ]
          }, margin: [0, 20]
        }


      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    };
    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }

  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  addProduct() {
    this.invoice.products.push(new Product());
  }

};
