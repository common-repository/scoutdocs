<?php defined( 'WPINC' ) or die; ?>

<script>
(function(ScoutDocs){
	var initialData = <?= json_encode( $react_data ); ?>;

	ScoutDocs.init(
		document.getElementById('scoutdocs-app'),
		initialData
	);

<?php if ( preg_match( '#' . preg_quote( trailingslashit( $react_data->urls->scoutdocsPath ), '#' ) . '(\d+)/?$#', $_SERVER['REQUEST_URI'], $matches ) ) { ?>

	// Dispatch the doc view.
	ScoutDocs.viewDoc(<?= json_encode( (int) $matches[1] ); ?>);

<?php } ?>

})(ScoutDocs);
</script>

</body>
</html>
