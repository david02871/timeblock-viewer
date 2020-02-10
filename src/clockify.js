import { getCurrentlyLoggedInUser, get50MostRecentTimeEntries, findProjectsOnWorkspace } from './clockifyApi.js';

export async function getTimeBlocks() {
    const user = await getCurrentlyLoggedInUser();
    const projects = await findProjectsOnWorkspace(user.activeWorkspace);
    const { timeEntriesList } = await get50MostRecentTimeEntries(user.activeWorkspace, user.id);

    let timeBlocks = timeEntriesList.map(tb => {
        const project = projects.find(p => p.id === tb.projectId);
        const start = Date.parse(tb.timeInterval.start);
        // in-progress timeblocks have an end date of null which we set to the current time
        const end = Date.parse(tb.timeInterval.end) || new Date().getTime();

        return {
            start,
            end,
            name: project ? project.name : 'No Project',
            color: project ? project.color : 'darkgrey'
        }
    });

    // Sort Ascending
    timeBlocks = timeBlocks.sort((a, b) => a.end - b.end);

    return timeBlocks;
}