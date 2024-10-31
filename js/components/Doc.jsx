import React, { Fragment } from 'react';
import { docIsImage } from '../utils/doc';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

class Doc extends React.Component {
	static propTypes = {
		doc: PropTypes.shape({
			id: PropTypes.number,
		}).isRequired,
		urls: PropTypes.object.isRequired,
	};

	renderFile(doc) {
		if (docIsImage(doc)) {
			return <img className="img-fluid" id="scoutdocs-image" src={doc.link} />;
		} else {
			return (
				<Fragment>
					<p>
						<b>{doc.title}</b> cannot be displayed, but you can download it:
					</p>
					<a href={doc.link} className="btn btn-primary download">
						<FontAwesomeIcon icon="cloud-download-alt" />&nbsp;&nbsp;Download
					</a>
				</Fragment>
			);
		}
	}

	render() {
		const doc = this.props.doc;
		const urls = this.props.urls;

		if ('pdf' === doc.type) {
			return (
				<iframe
					id="scoutdocs-pdf"
					src={`${
						urls.plugin
					}js/vendor/pdfjs/web/viewer.html?file=${encodeURIComponent(
						doc.link
					)}`}
				/>
			);
		} else {
			return (
				<div className="container-md">
					<div className="row no-gutters">
						<div className="col-12 text-center my-4">
							{this.renderFile(doc)}
						</div>
					</div>
				</div>
			);
		}
	}
}

export default Doc;
