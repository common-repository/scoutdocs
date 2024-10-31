<?php defined( 'WPINC' ) or die; ?>

<tr>
	<th scope="row"><label for="<?= esc_attr( $setting->get_full_name() ) ?>"><?= $setting->get_human_name() ?></label></th>
	<td>
		<textarea name="<?= esc_attr( $setting->get_full_name() ) ?>" id="<?= esc_attr( $setting->get_full_name() ) ?>" class="regular-text regular-textarea" required><?= esc_textarea( $setting->get_admin() ) ?></textarea>
		<?= $description ?>
	</td>
</tr>
