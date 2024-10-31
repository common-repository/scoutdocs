<?php defined( 'WPINC' ) or die; ?>

<tr>
	<th scope="row"><label for="<?= esc_attr( $setting->get_full_name() ) ?>"><?= $setting->get_human_name() ?></label></th>
	<td>
		<?= $setting->get_data( 'prefix' ) ?><input name="<?= esc_attr( $setting->get_full_name() ) ?>" type="email" id="<?= esc_attr( $setting->get_full_name() ) ?>" class="regular-text regular-email" value="<?= esc_attr( $setting->get_admin() ) ?>" placeholder="<?= esc_attr( $setting->get_data( 'placeholder' ) ) ?>" required />
		<?= $description ?>
	</td>
</tr>
