SELECT producto.id_producto, codigo, nombre, precio, descripcion, cantidad
FROM public.producto_persona
INNER JOIN public.producto ON producto_persona.id_producto = producto.id_producto
WHERE id_persona=$1; 