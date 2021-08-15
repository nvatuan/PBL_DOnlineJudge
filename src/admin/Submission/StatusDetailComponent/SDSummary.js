import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import {V2C, VS} from '../../../constant/SubmissionVerdict'

function StatusDetailSummary({ submission }) {

	const timeFormatter = (timestring) => {
		if (typeof timestring === undefined) return "";
		var d = new Date(timestring);
		var dformat = [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/')+' '+[d.getHours(),d.getMinutes(),d.getSeconds()].join(':');
		return dformat;
	};


	try {
		return (
			<div className="submission-info status_details-container__item">
				<Card>
					<Card.Header as="h3" >Submission Info</Card.Header>
					<Card.Body>
						<table>
							<tbody>
								<tr>
									<td>Submission Time</td>
									<td>{timeFormatter(submission.submit_time)}</td>
								</tr>
								<tr>
									<td>Author</td>
									<td>{submission.author_name}</td>
								</tr>
								<tr>
									<td>Problem</td>
									<td><Link to={`/problem/${submission.problem_id}`}>{submission.problem_title}</Link></td>
								</tr>
								<tr>
									<td>Language</td>
									<td>{submission.language}</td>
								</tr>
								<tr>
									<td>Status</td>
									<td>
										<div className={`verdict-text ${V2C(submission.verdict)}`}>
											<div>{(submission.verdict)}</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>Execution Time</td>
									<td>
										{submission.time} ms
									</td>
								</tr>
								<tr>
									<td>Memory Usage</td>
									<td>
										{submission.memory} KB
									</td>
								</tr>
							</tbody>
						</table>
					</Card.Body>
				</Card>
			</div>
		)
	} catch {
		return (
			<div className="submission-info status_details-container__item">
				<Card>
					<Card.Header as="h3" >Submission Info</Card.Header>
					<Card.Body>
						<div className='wait-text'> Please wait a moment... </div>
					</Card.Body>
				</Card>
			</div>
		)
	}
}

export default StatusDetailSummary;
