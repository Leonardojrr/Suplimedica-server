SELECT persona.id_persona, nombre_persona, ci_persona, direccion_persona, numero_persona
FROM public.producto_persona
INNER JOIN public.persona ON producto_persona.id_persona = persona.id_persona
WHERE id_producto=$1;