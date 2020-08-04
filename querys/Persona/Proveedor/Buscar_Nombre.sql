SELECT * FROM public.persona 
WHERE nombre_persona LIKE $1 AND tipo_persona='proveedor';