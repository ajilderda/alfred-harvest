import { alfredError } from './utils/errors';
import { apiCall } from './utils/helpers';
const alfy = require('alfy');

const vars = process.env;
const { projectId } = vars;

const url = 'https://api.harvestapp.com/v2/users/me/project_assignments'


await apiCall(url, 'GET')
    .then(response => {
        const project = response.project_assignments.filter(element => element.project.id == projectId )[0]

        const items = alfy
            .inputMatches(project.task_assignments, 'task.name')
            .filter(element => element.is_active)
            .map(element => ({
                uid: element.id,
                title: element.task.name,
                subtitle: 'Start this task',
                variables: {
                    taskId: element.task.id,
                    taskName: element.task.name
                },
                icon: {
                    path: 'src/icons/start.png'
                }
            }));

        alfy.output(items);
    })
    .catch(error => {
        alfredError(error, 'Failed to list project tasks.');
    });