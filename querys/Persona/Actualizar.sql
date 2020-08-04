UPDATE public.persona
	SET nombre_persona=$2, direccion_persona=$3, numero_persona=$4, ci_persona=$5
	WHERE id_persona=$1;