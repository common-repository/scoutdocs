import React, { Fragment } from 'react';
import ListItem from './ListItem';
import { Tooltip } from 'react-tippy';
import { yes, no, on, off } from '../utils/bools';

const UsersTooltip = ({ users = [], children, showStatus = no }) => {
	const usersHtml = users.map(u => {
		const status = u.status || 'unread';
		return (
			<ListItem key={u.id}>
				<span>{u.name}</span>
				{showStatus && (
					<span key={status} className={`status status-${status}`}>
						{status}
					</span>
				)}
			</ListItem>
		);
	});
	return (
		<Tooltip
			html={<ul className="users-tooltip">{usersHtml}</ul>}
			delay={250}
			position="bottom"
			arrow={yes}
		>
			{children}
		</Tooltip>
	);
};

export default UsersTooltip;
