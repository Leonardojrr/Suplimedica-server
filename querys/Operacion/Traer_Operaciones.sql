SELECT id_operacion, fecha_operacion, total_operacion, id_usuario FROM public.operacion
WHERE id_persona=$1 ORDER BY id_operacion DESC;