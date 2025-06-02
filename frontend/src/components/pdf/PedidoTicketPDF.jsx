import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    width: '80mm',
    minHeight: '100mm',
    padding: '3mm',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: '3mm',
    textAlign: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: '2mm',
  },
  subtitle: {
    fontSize: 8,
    marginBottom: '2mm',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'dashed',
    marginVertical: '2mm',
  },
  section: {
    marginBottom: '3mm',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '1mm',
  },
  label: {
    fontSize: 8,
  },
  value: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  productRow: {
    flexDirection: 'row',
    marginBottom: '1mm',
  },
  quantity: {
    fontSize: 8,
    width: '10mm',
  },
  productName: {
    fontSize: 8,
    flex: 1,
  },
  productPrice: {
    fontSize: 8,
    width: '15mm',
    textAlign: 'right',
  },
  subtotal: {
    fontSize: 8,
    width: '15mm',
    textAlign: 'right',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '2mm',
    paddingTop: '2mm',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderTopStyle: 'dashed',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: '5mm',
    fontSize: 8,
    textAlign: 'center',
  },
  paymentSection: {
    marginTop: '3mm',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '1mm',
  },
});

const PedidoTicketPDF = ({ pedido }) => {
  const formatMonto = (monto) => {
    const numero = Number(monto);
    return isNaN(numero) ? '0.00' : numero.toFixed(2);
  };

  const formatearFecha = (fecha) => {
    try {
      const fechaObj = new Date(fecha);
      fechaObj.setHours(fechaObj.getHours() - 4); // Ajuste a UTC-4 (La Paz)
      return fechaObj.toLocaleString('es-BO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  return (
    <Document>
      <Page size={[226.8, 400]} style={styles.page}> {/* 80mm = 226.8pt */}
        <View style={styles.header}>
          <Text style={styles.title}>PEDIDO CANCELADO</Text>
          <Text style={styles.subtitle}>Nro. Pedido: {pedido.id}</Text>
          <Text style={styles.subtitle}>Fecha: {formatearFecha(pedido.fecha)}</Text>
          <Text style={styles.subtitle}>Cliente: {pedido.nombre}</Text>
          <Text style={styles.subtitle}>Atendido por: {pedido.nombre_usuario}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>DETALLE DEL PEDIDO:</Text>
          {pedido.productos?.map((producto, index) => (
            <View key={index} style={styles.productRow}>
              <Text style={styles.quantity}>{producto.cantidad}x</Text>
              <Text style={styles.productName}>{producto.nombre}</Text>
              <Text style={styles.productPrice}>${formatMonto(producto.precio)}</Text>
              <Text style={styles.subtotal}>
                ${formatMonto(producto.precio * producto.cantidad)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.total}>
          <Text style={styles.totalLabel}>TOTAL:</Text>
          <Text style={styles.totalValue}>${formatMonto(pedido.total)}</Text>
        </View>

        {pedido.pagos && pedido.pagos.length > 0 && (
          <View style={styles.paymentSection}>
            <Text style={styles.label}>PAGOS REALIZADOS:</Text>
            {pedido.pagos.map((pago, index) => (
              <View key={index} style={styles.paymentRow}>
                <Text style={styles.label}>{pago.metodo.toUpperCase()}:</Text>
                <Text style={styles.value}>${formatMonto(pago.monto)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text>*** PEDIDO CANCELADO ***</Text>
          <Text>Gracias por su preferencia</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PedidoTicketPDF; 