import { useEffect, useState } from "react";

export const useGitHubStars = (repo: string) => {
    const [stars, setStars] = useState<number | null>(null);

    useEffect(() => {
        const fetchStars = async () => {
            try {
                const res = await fetch(`https://api.github.com/repos/${repo}`);
                const data = await res.json();
                if (data.stargazers_count !== undefined) {
                    setStars(data.stargazers_count);
                }
            } catch (error) {
                console.error("Fehler beim Laden der GitHub-Stars:", error);
            }
        };

        fetchStars();
    }, [repo]);

    return stars;
};
