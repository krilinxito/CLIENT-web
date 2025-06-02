import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 5,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#E4E4E4',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10,
  },
  total: {
    marginTop: 20,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
  },
});

const PedidoTicketPDF = ({ pedido }) => {
  // Formatear fecha a zona horaria de La Paz
  const formatearFecha = (fecha) => {
    try {
      const fechaLaPaz = new Date(new Date(fecha).toLocaleString('en-US', { timeZone: 'America/La_Paz' }));
      return fechaLaPaz.toLocaleString('es-BO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha inválida';
    }
  };

  // Agrupar productos idénticos
  const agruparProductos = (productos) => {
    if (!productos || !Array.isArray(productos)) return [];
    
    const productosAgrupados = productos.reduce((acc, producto) => {
      if (producto.anulado) return acc;
      
      const key = `${producto.id_producto || producto.idProducto}-${producto.precio}`;
      if (!acc[key]) {
        acc[key] = {
          ...producto,
          cantidad: Number(producto.cantidad || 0)
        };
      } else {
        acc[key].cantidad += Number(producto.cantidad || 0);
      }
      return acc;
    }, {});

    return Object.values(productosAgrupados);
  };

  // Calcular total
  const calcularTotal = () => {
    if (!pedido.productos || !Array.isArray(pedido.productos)) return 0;
    
    return pedido.productos.reduce((sum, p) => {
      if (p.anulado) return sum;
      const precio = Number(p.precio) || 0;
      const cantidad = Number(p.cantidad) || 0;
      return sum + (precio * cantidad);
    }, 0);
  };

  // Agrupar los productos antes de renderizar
  const productosAgrupados = agruparProductos(pedido.productos);

  return (
    <Document>
      <Page size="A6" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Ticket de Pedido</Text>
          <Text style={styles.subtitle}>Pedido #{pedido.id}</Text>
          <Text style={styles.subtitle}>Fecha: {formatearFecha(pedido.fecha)}</Text>
          <Text style={styles.subtitle}>Cliente: {pedido.nombre}</Text>
          <Text style={styles.subtitle}>Atendido por: {pedido.nombre_usuario}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text>Producto</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text>Cant.</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text>Precio</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text>Subtotal</Text>
              </View>
            </View>

            {productosAgrupados.map((producto, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text>{producto.nombre}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{producto.cantidad}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>${Number(producto.precio).toFixed(2)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>
                    ${(Number(producto.precio) * Number(producto.cantidad)).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.total}>
            Total: ${calcularTotal().toFixed(2)}
          </Text>
        </View>

        {pedido.pagos && pedido.pagos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Pagos Realizados:</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, { width: '50%' }]}>
                  <Text>Método</Text>
                </View>
                <View style={[styles.tableColHeader, { width: '50%' }]}>
                  <Text>Monto</Text>
                </View>
              </View>

              {pedido.pagos.map((pago, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.tableCol, { width: '50%' }]}>
                    <Text>{pago.metodo}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '50%' }]}>
                    <Text>${Number(pago.monto).toFixed(2)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text>¡Gracias por su compra!</Text>
          <Text>Estado: {pedido.estado}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PedidoTicketPDF; 