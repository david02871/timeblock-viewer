import { getCurrentlyLoggedInUser, get50MostRecentTimeEntries, findProjectsOnWorkspace } from './clockifyApi.js';

export async function getTimeBlocks() {
    const user = await getCurrentlyLoggedInUser();
    const projects = await findProjectsOnWorkspace(user.activeWorkspace);
    const { timeEntriesList } = await get50MostRecentTimeEntries(user.activeWorkspace, user.id);

    const timeBlocks = timeEntriesList.map(tb => {
        const project = projects.find(p => p.id === tb.projectId);

        return {
            start: Date.parse(tb.timeInterval.start),
            end: Date.parse(tb.timeInterval.end),
            project: {
                name: project ? project.name : 'No Project',
                color: project ? project.color : 'darkgrey'
            }
        }
    });

    return timeBlocks;
}