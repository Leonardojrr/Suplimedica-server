SELECT * FROM public.persona 
WHERE ci_persona LIKE $1 AND tipo_persona='cliente';