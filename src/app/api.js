const SERVICE_FIELDS = 'id,name,applicationName,homeUrl';

const SPRINT_FIELDS = 'id,name,start,finish';
const AGILE_FIELDS = `id,name,sprints(${SPRINT_FIELDS}),sprintsSettings(disableSprints,explicitQuery),columnSettings(field(id,name)),owner(id,ringId,fullName)`;
const SPRINT_BOARD_CELL_FIELDS = 'id,column(id),issues(id)';
const SPRINT_BOARD_ROW_FIELDS = `id,cells(${SPRINT_BOARD_CELL_FIELDS})`;
const SPRINT_BOARD_COLUMN_FIELDS = 'id,agileColumn(fieldValues(name,presentation),wipLimit(max,min))';
const SPRINT_BOARD_FIELDS = `id,name,columns(${SPRINT_BOARD_COLUMN_FIELDS}),swimlanes(${SPRINT_BOARD_ROW_FIELDS}),orphanRow(${SPRINT_BOARD_ROW_FIELDS})`;
const SPRINT_EXTENDED_FIELDS = `${SPRINT_FIELDS},board(${SPRINT_BOARD_FIELDS}),goal`;

export async function loadAgiles(fetchYouTrack) {
  return await fetchYouTrack(`api/agiles?fields=${AGILE_FIELDS}`);
}

export async function loadAgile(fetchYouTrack, agileId) {
  return await fetchYouTrack(`api/agiles/${agileId}?fields=${AGILE_FIELDS}`);
}

export async function loadCurrentUser(fetchYouTrack) {
  return await fetchYouTrack('rest/user/current');
}

export async function loadExtendedSprintData(fetchYouTrack, boardId, sprintId) {
  return await fetchYouTrack(`api/agiles/${boardId}/sprints/${sprintId}?fields=${SPRINT_EXTENDED_FIELDS}`);
}

export async function loadTimeForIssue(fetchYouTrack, issue) {
  return await fetchYouTrack(`rest/issue/${issue}/timetracking/workitem`);
}

export async function loadInProgressIssues(fetchYouTrack) {
  return await fetchYouTrack('rest/issue/?filter=for%3A+me+In+Progress');
}

export async function postWorkItem(fetchYouTrack, issue, data) {
  return await fetchYouTrack(`rest/issue/${issue}/timetracking/workitem`, {body: data, method: 'POST'});
}

export async function getYouTrackServices(fetchHub) {
  const data = await fetchHub(`api/rest/services?fields=${SERVICE_FIELDS}`);
  return (data.services || []).filter(
    service => service.applicationName === 'YouTrack' && !!service.homeUrl
  );
}

export async function getYouTrackService(fetchHub, youTrackId) {
  const services = await getYouTrackServices(fetchHub);
  if (youTrackId) {
    return services.filter(
      service => service.id === youTrackId
    )[0];
  }
  return services[0];
}
