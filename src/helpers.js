import { getCurrentlyLoggedInUser, get50MostRecentTimeEntries, findProjectsOnWorkspace } from './clockifyApi.js';

export const getTimeBlocks = async () => {
    const user = await getCurrentlyLoggedInUser();
    const projects = await findProjectsOnWorkspace(user.activeWorkspace);
    const { timeEntriesList } = await get50MostRecentTimeEntries(user.activeWorkspace, user.id);

    let isTracking = false;
    let timeEntries = timeEntriesList.map(tb => {
        const project = projects.find(p => p.id === tb.projectId);
        const start = Date.parse(tb.timeInterval.start);
        const endTime = Date.parse(tb.timeInterval.end);

        // in-progress timeblocks have an end date of null which we set to the current time
        if (!endTime) {
            isTracking = true;
        }

        return {
            start,
            end: endTime || new Date().getTime(),
            name: project ? project.name : 'No Project',
            color: project ? project.color : 'darkgrey'
        }
    });

    // Sort Ascending
    timeEntries = timeEntries.sort((a, b) => a.end - b.end);

    return [ timeEntries, isTracking ];
}