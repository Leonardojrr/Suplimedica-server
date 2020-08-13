INSERT INTO public.operacion(
	id_persona, fecha_operacion, total_operacion, tipo_operacion, id_usuario)
	VALUES ($1, $2, $3, 'venta', $4) RETURNING id_operacion;