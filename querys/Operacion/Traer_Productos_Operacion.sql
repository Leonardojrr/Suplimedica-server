SELECT codigo,nombre,precio,cantidad_operacion_producto,costo_operacion_producto FROM public.operacion_producto 
INNER JOIN public.producto ON operacion_producto.id_producto = producto.id_producto
WHERE id_operacion=$1;