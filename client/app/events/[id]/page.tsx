'use client';

import Navbar from '../../components/Navbar';
import { DotOrbit } from '@paper-design/shaders-react';
import Crewmates from '../../components/Crewmates';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';

const EventPage = () => {
	const { id } = useParams();
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchEventById = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/events/${id}`);
				const data = await res.json().catch(() => ({}));

				if (!res.ok) {
					toast.error(data.error || "Failed to fetch events");
					return;
				}

				setEvent(data);
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
					console.log(error);
				} else {
					console.log("An unknown error occurred", error);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchEventById();
	}, [id]);

	console.log({ loading, event });

	return (
		<div className="w-full min-h-screen relative" data-main-content>
			<Navbar />
			<div className="fixed inset-0 w-full h-full z-0">
				<DotOrbit
					width="100%"
					height="100%"
					colors={['#ffffff', '#006aff', '#fff675']}
					colorBack="#000000"
					stepsPerColor={4}
					size={0.2}
					sizeRange={0.5}
					spreading={1}
					speed={0.5}
					scale={0.35}
				/>
			</div>
			<div className="relative z-10 h-screen overflow-hidden">
				<Crewmates />
			</div>
		</div>
	);
};

export default EventPage;