SELECT * FROM public.persona 
WHERE nombre_persona LIKE $1 AND ci_persona LIKE $2 AND tipo_persona='proveedor';