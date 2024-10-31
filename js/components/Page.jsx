import React, { Fragment } from 'react';
import TopNav from '../containers/TopNav';
import ScoutDocsVelocity from './ScoutDocsVelocity';
import GroupManager from '../containers/GroupManager';
import Uploader from '../containers/Uploader';
import classNames from 'classnames';

// Note, ScoutDocsVelocity should wrap the column, otherwise it is jittery.
const renderUploader = (open = false) => {
	const openClass = open ? 'open' : '';

	return (
		<div className={`row uploader-row ${openClass}`}>
			<ScoutDocsVelocity
				animation={open ? 'slideDown' : 'slideUp'}
				duration={300}
			>
				<div className="col-12">
					<Uploader />
				</div>
			</ScoutDocsVelocity>
		</div>
	);
};

export default ({
	children,
	navCenter = [],
	fullWidth = false,
	containerClasses,
	canManageGroups,
	uploaderOpen,
}) => {
	const classes = {
		'container-full': fullWidth,
		container: !fullWidth,
	};

	return (
		<Fragment>
			<header>
				<TopNav centerItems={navCenter} />
			</header>
			<div className={classNames(classes, containerClasses)}>
				{renderUploader(uploaderOpen)}
				{children}
			</div>

			{canManageGroups && <GroupManager />}
		</Fragment>
	);
};
