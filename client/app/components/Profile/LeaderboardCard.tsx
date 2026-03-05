import Image from "next/image";
import HandDrawnCard from "../HandDrawnCard";
import { LeaderBoard } from "@/types/interface";

interface LeaderBoardProps {
	leaderboard: LeaderBoard[];
}

const LeaderboardCard = ({ leaderboard }: LeaderBoardProps) => {
	return (
		<HandDrawnCard className="p-6 mt-4">
			<h2 className="hand-drawn-title text-white text-xl sm:text-2xl mb-4">
				Top 10 Leaderboard
			</h2>
			<div className="space-y-2">
				{leaderboard.length > 0 ? (
					leaderboard.map((entry, i) => (
						<div
							key={i}
							className="flex items-center justify-between p-2 rounded bg-black/20 border border-white/10"
						>
							<div className="flex items-center gap-3">
								<span className="text-cyan font-bold w-8">#{i + 1}</span>
								{entry.avatar != null && (
									<Image
										src={`/${entry.avatar}.png`}
										alt=""
										width={24}
										height={24}
										className="rounded-full object-cover w-6 h-6"
									/>
								)}
								<span className="text-white font-medium truncate max-w-35 sm:max-w-50">
									{entry.username}
								</span>
							</div>
							<span className="text-[#fff675] font-bold shrink-0">
								{entry.amongUsScore}
							</span>
						</div>
					))
				) : (
					<p className="text-white/60 text-sm">No players yet. Be the first!</p>
				)}
			</div>
		</HandDrawnCard>
	)
}

export default LeaderboardCard;