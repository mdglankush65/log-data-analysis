interface UserSession {
    userId: string;
    deviceId: string;
    loggedIn: Date;
    loggedOut: Date | null;
    lastSeenAt: Date;
}

interface MonthlyStats {
    month: string;
    loggedInUsers: Set<string>;
    activeUsers: Set<string>;
}

const getMonthlyStats = (sessions: UserSession[], year: number): MonthlyStats[] => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
    
    const stats: MonthlyStats[] = months.map((monthStart, i) => {
        const monthEnd = new Date(year, i + 1, 0, 23, 59, 59);
        return {
            month: monthStart.toISOString().slice(0, 7),
            loggedInUsers: new Set<string>(),
            activeUsers: new Set<string>()
        };
    });

    sessions.forEach(session => {
        stats.forEach(stat => {
            const { month, loggedInUsers, activeUsers } = stat;
            const [year, monthStr] = month.split("-");
            const monthStart = new Date(Number(year), Number(monthStr) - 1, 1);
            const monthEnd = new Date(Number(year), Number(monthStr), 0, 23, 59, 59);

            if (
                session.loggedIn <= monthEnd &&
                (session.loggedOut === null || session.loggedOut >= monthStart)
            ) {
                loggedInUsers.add(session.userId);
            }

            if (
                session.lastSeenAt >= monthStart &&
                session.lastSeenAt <= monthEnd
            ) {
                activeUsers.add(session.userId);
            }
        });
    });

    return stats;
};
