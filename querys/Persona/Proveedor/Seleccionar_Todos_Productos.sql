SELECT id_persona, producto.id_producto, codigo, nombre, precio, descripcion
FROM public.producto_persona
INNER JOIN public.producto ON producto_persona.id_producto = producto.id_producto