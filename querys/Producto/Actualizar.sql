UPDATE public.producto
	SET codigo=$1, nombre=$2, precio=$3, marca=$4
	WHERE id_producto=$5;