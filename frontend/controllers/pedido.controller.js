const obtenerTodosLosPedidosController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filtros = {
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      estado: req.query.estado,
      usuario: req.query.usuario
    };

    const resultado = await obtenerTodosLosPedidos(page, limit, filtros);
    res.json({
      data: resultado.pedidos,
      total: resultado.total
    });
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    res.status(500).json({
      error: 'Error al obtener los pedidos',
      details: error.message
    });
  }
}; 