jQuery(function($) {
	// Show support.
	$('.show-support').on('click', function() {
		$(this).fadeOut(function() {
			$('.support-message').hide();
			$('form.support').fadeIn();
		});
	});

	// Preview diagnostics.
	$('form.support .view-diagnostics').on('click', function(e) {
		e.preventDefault();
		$('form.support .diagnostics-preview').show();
	});

	// Validate support form.
	$('form.support').validate({
		rules: {
			scoutdocs_subject: 'required',
			scoutdocs_body: 'required',
			scoutdocs_email: {
				required: true,
				email: true,
			},
		},
		messages: sdSupportVars.messages,
		submitHandler: function() {
			$.ajax({
				url: sdSupportVars.ajax_url,
				data: {
					action: 'support_ticket',
					email: $('input[name="scoutdocs_email"]').val(),
					name: $('input[name="scoutdocs_name"]').val(),
					subject: $('input[name="scoutdocs_subject"]').val(),
					body: $('textarea[name="scoutdocs_body"]').val(),
					_scoutdocs_support_nonce: sdSupportVars.ajax_nonce,
				},
				method: 'POST',

				beforeSend: function() {
					$('.loading').show();
				},

				success: function(response) {
					$('.support-message').html(response.data.message);
					$('form.support')[0].reset();
					$('.loading').hide();
					$('form.support').fadeOut(function() {
						$('.show-support, .support-message').show();
					});
				},

				error: function(data) {
					console.log(data);
					$('.support-message')
						.html('Error: ' + data.message)
						.show();
					$('form.support')[0].reset();
					$('.loading').hide();
				},
			});
		},
	});
});
