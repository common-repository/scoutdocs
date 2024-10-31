<?php
/**
 * The ScoutDocs_API_Response class.
 *
 * @package scoutdocs\plugin
 */

/**
 * A class for handling responses from the ScoutDocs API.
 */
class ScoutDocs_API_Response {
	/**
	 * Whether the response was an error.
	 *
	 * @var bool
	 */
	protected $is_error = false;

	/**
	 * The response data.
	 *
	 * @var array
	 */
	protected $data = [];

	/**
	 * A WP_Error object containing the error.
	 *
	 * @var WP_Error
	 */
	protected $error;

	/**
	 * Construct an API response object.
	 *
	 * @param mixed  $result The raw response.
	 * @param string $url The URL the original request was sent to.
	 */
	public function __construct( $result, $url = '' ) {
		if ( is_wp_error( $result ) ) {
			// Something went wrong on the HTTP level.
			$this->is_error = true;
			$this->error = $result;
			$data = $this->error->get_error_data();
			$data['url'] = $url;
			$this->error->add_data( $data );
		} elseif ( is_array( $result ) ) {
			if ( isset( $result['body'] ) && isset( $result['response'] ) ) {
				$response = $result['response'];
				$body = json_decode( $result['body'] );
				if ( isset( $response['code'] ) && 200 === absint( $response['code'] ) ) {
					if ( is_object( $body ) && isset( $body->data ) ) {
						$this->data = $body->data;
					}
				} elseif ( isset( $body->code ) && isset( $body->message ) ) {
					// An error.
					$this->is_error = true;
					$data = [];
					if ( in_array( $body->code, [
						'rest_no_route',
						'http_request_failed',
					] ) ) {
						$data['url'] = $url;
					}
					$this->error = new WP_Error( $body->code, $body->message, $data );
				} else {
					// An unknown error.
					$this->is_error = true;
					$this->error = new WP_Error( 'malformed-response', __( 'The response was not successful, but I do not know why.', 'scoutdocs' ) );
				}
			}
		}
	}

	/**
	 * Whether the response was an error.
	 *
	 * @return bool Whether the response was an error.
	 */
	public function is_error() {
		return (bool) $this->is_error;
	}

	/**
	 * Whether the response indicates success.
	 *
	 * @return bool Whether the response was successful.
	 */
	public function is_success() {
		return ! $this->is_error();
	}

	/**
	 * Gets the error.
	 *
	 * @return WP_Error The error object.
	 */
	public function get_error() {
		return $this->error;
	}

	/**
	 * Returns the error message.
	 *
	 * @return string The error message.
	 */
	public function get_error_message() {
		return $this->get_error()->get_error_message();
	}

	/**
	 * Returns the response data.
	 *
	 * @param string $subkey The optional subkey of the data to return.
	 *
	 * @return mixed The response data.
	 */
	public function get_data( $subkey = null ) {
		$data = $this->data;

		if ( ! empty( $subkey ) ) {
			if ( isset( $data->$subkey ) ) {
				$data = $data->$subkey;
			} else {
				$data = null;
			}
		}

		return $data;
	}

	/**
	 * Returns the result data or a WP_Error depending on success.
	 *
	 * @return array|WP_Error The result data or a WP_Error.
	 */
	public function get() {
		if ( $this->is_success() ) {
			return $this->get_data();
		} else {
			return $this->get_error();
		}
	}
}
