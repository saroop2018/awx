/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import OrganizationsJobTemplatesRoute from '~features/templates/routes/organizationsTemplatesList.route';

import OrganizationsAdmins from './controllers/organizations-admins.controller';
import OrganizationsInventories from './controllers/organizations-inventories.controller';
import OrganizationsProjects from './controllers/organizations-projects.controller';
import OrganizationsTeams from './controllers/organizations-teams.controller';
import OrganizationsUsers from './controllers/organizations-users.controller';
import { N_ } from '../../i18n';

let lists = [{
    name: 'organizations.users',
    url: '/:organization_id/users',
    searchPrefix: 'user',
    views: {
        'form': {
            controller: OrganizationsUsers,
            templateProvider: function(OrgUserList, generateList) {
                let html = generateList.build({
                    list: OrgUserList,
                    mode: 'edit',
                    cancelButton: true
                });
                return generateList.wrapPanel(html);
            },
        }
    },
    params: {
        user_search: {
            value: {
                order_by: 'username'
            },
            dynamic: true
        }
    },
    ncyBreadcrumb: {
        parent: "organizations.edit",
        label: N_("USERS")
    },

    data: {
        activityStream: true,
        activityStreamTarget: 'organization'
    },
    resolve: {
        features: ['FeaturesService', function(FeaturesService) {
            return FeaturesService.get();
        }],
        OrgUsersDataset: ['OrgUserList', 'QuerySet', '$stateParams', 'GetBasePath',
            function(list, qs, $stateParams, GetBasePath) {
                let path = GetBasePath(list.basePath) || list.basePath;
                return qs.search(path, $stateParams.user_search);
            }
        ],
        OrgUserList: ['UserList', 'GetBasePath', '$stateParams', function(UserList, GetBasePath, $stateParams) {
            let list = _.cloneDeep(UserList);
            delete list.actions.add;
            list.basePath = `${GetBasePath('organizations')}${$stateParams.organization_id}/users`;
            list.searchRowActions = {
                add: {
                    awToolTip: 'Add existing user to organization',
                    actionClass: 'at-Button--add',
                    actionId: 'button-add',
                    ngClick: 'addUsers()'
                }
            };
            return list;
        }]
    }
}, {
    name: 'organizations.teams',
    url: '/:organization_id/teams',
    searchPrefix: 'team',
    views: {
        'form': {
            controller: OrganizationsTeams,
            templateProvider: function(OrgTeamList, generateList) {
                let html = generateList.build({
                    list: OrgTeamList,
                    mode: 'edit',
                    cancelButton: true
                });
                return generateList.wrapPanel(html);
            },
        },
    },
    data: {
        activityStream: true,
        activityStreamTarget: 'organization'
    },
    ncyBreadcrumb: {
        parent: "organizations.edit",
        label: N_("TEAMS")
    },
    resolve: {
        features: ['FeaturesService', function(FeaturesService) {
            return FeaturesService.get();
        }],
        OrgTeamList: ['TeamList', 'GetBasePath', '$stateParams', function(TeamList, GetBasePath, $stateParams) {
            let list = _.cloneDeep(TeamList);
            delete list.actions.add;
            // @issue Why is the delete action unavailable in this view?
            delete list.fieldActions.delete;
            list.listTitle = N_('Teams') + ` | {{ name }}`;
            list.basePath = `${GetBasePath('organizations')}${$stateParams.organization_id}/teams`;
            list.emptyListText = `${N_('This list is populated by teams added from the')}&nbsp;<a ui-sref='teams.add'>${N_('Teams')}</a>&nbsp;${N_('section')}`;
            return list;
        }],
        OrgTeamsDataset: ['OrgTeamList', 'QuerySet', '$stateParams', 'GetBasePath',
            function(list, qs, $stateParams, GetBasePath) {
                let path = GetBasePath(list.basePath) || list.basePath;
                return qs.search(path, $stateParams.team_search);
            }
        ]
    }
}, {
    name: 'organizations.inventories',
    url: '/:organization_id/inventories',
    searchPrefix: 'inventory',
    views: {
        'form': {
            controller: OrganizationsInventories,
            templateProvider: function(OrgInventoryList, generateList) {
                let html = generateList.build({
                    list: OrgInventoryList,
                    mode: 'edit',
                    cancelButton: true
                });
                return generateList.wrapPanel(html);
            },
        },
    },
    data: {
        activityStream: true,
        activityStreamTarget: 'organization'
    },
    ncyBreadcrumb: {
        parent: "organizations.edit",
        label: N_("INVENTORIES")
    },
    resolve: {
        features: ['FeaturesService', function(FeaturesService) {
            return FeaturesService.get();
        }],
        OrgInventoryList: ['InventoryList', 'GetBasePath', '$stateParams', function(InventoryList, GetBasePath, $stateParams) {
            let list = _.cloneDeep(InventoryList);
            delete list.actions.add;
            // @issue Why is the delete action unavailable in this view?
            delete list.fieldActions.delete;
            list.title = true;
            list.listTitle = N_('Inventories') + ` | {{ name }}`;
            list.basePath = `${GetBasePath('organizations')}${$stateParams.organization_id}/inventories`;
            list.emptyListText = `${N_("This list is populated by inventories added from the")}&nbsp;<a ui-sref='inventories.add'>${N_("Inventories")}</a>&nbsp;${N_("section")}`;
            return list;
        }],
        OrgInventoryDataset: ['OrgInventoryList', 'QuerySet', '$stateParams', 'GetBasePath',
            function(list, qs, $stateParams, GetBasePath) {
                let path = GetBasePath(list.basePath) || list.basePath;
                return qs.search(path, $stateParams.inventory_search);
            }
        ]
    }
}, {
    name: 'organizations.projects',
    url: '/:organization_id/projects',
    searchPrefix: 'project',
    views: {
        'form': {
            controller: OrganizationsProjects,
            templateProvider: function(OrgProjectList, generateList) {
                let html = generateList.build({
                    list: OrgProjectList,
                    mode: 'edit',
                    cancelButton: true
                });
                return generateList.wrapPanel(html);
            },
        },
    },
    data: {
        activityStream: true,
        activityStreamTarget: 'organization',
        socket: {
            "groups": {
                "jobs": ["status_changed"]
            }
        },
    },
    ncyBreadcrumb: {
        parent: "organizations.edit",
        label: N_("PROJECTS")
    },
    resolve: {
        features: ['FeaturesService', function(FeaturesService) {
            return FeaturesService.get();
        }],
        OrgProjectList: ['ProjectList', 'GetBasePath', '$stateParams', function(ProjectList, GetBasePath, $stateParams) {
            let list = _.cloneDeep(ProjectList);
            delete list.actions;
            // @issue Why is the delete action unavailable in this view?
            delete list.fieldActions.delete;
            list.listTitle = N_('Projects') + ` | {{ name }}`;
            list.basePath = `${GetBasePath('organizations')}${$stateParams.organization_id}/projects`;
            list.emptyListText = `${N_("This list is populated by projects added from the")}&nbsp;<a ui-sref='projects.add'>${N_("Projects")}</a>&nbsp;${N_("section")}`;
            return list;
        }],
        OrgProjectDataset: ['OrgProjectList', 'QuerySet', '$stateParams', 'GetBasePath',
            function(list, qs, $stateParams, GetBasePath) {
                let path = GetBasePath(list.basePath) || list.basePath;
                return qs.search(path, $stateParams.project_search);
            }
        ]
    }
}, {
    name: 'organizations.admins',
    url: '/:organization_id/admins',
    searchPrefix: 'user',
    params: {
        user_search: {
            value: {
                order_by: 'username'
            },
            dynamic: true
        },
        add_user_search: {
            value: {
                order_by: 'username',
                page_size: '5',
            },
            dynamic: true,
            squash: true
        }
    },
    views: {
        'form': {
            controller: OrganizationsAdmins,
            templateProvider: function(OrgAdminList, generateList) {
                let html = generateList.build({
                    list: OrgAdminList,
                    mode: 'edit',
                    cancelButton: true
                });
                return generateList.wrapPanel(html);
            },
        }
    },
    data: {
        activityStream: true,
        activityStreamTarget: 'organization'
    },
    ncyBreadcrumb: {
        parent: "organizations.edit",
        label: N_("ADMINS")
    },
    resolve: {
        features: ['FeaturesService', function(FeaturesService) {
            return FeaturesService.get();
        }],
        OrgAdminsDataset: ['OrgAdminList', 'QuerySet', '$stateParams', 'GetBasePath',
            function(list, qs, $stateParams, GetBasePath) {
                let path = GetBasePath(list.basePath) || list.basePath;
                return qs.search(path, $stateParams[`user_search`]);
            }
        ],
        OrgAdminList: ['UserList', 'GetBasePath', '$stateParams', function(UserList, GetBasePath, $stateParams) {
            let list = _.cloneDeep(UserList);
            delete list.actions.add;
            list.basePath = `${GetBasePath('organizations')}${$stateParams.organization_id}/admins`;
            list.searchRowActions = {
                add: {
                    awToolTip: 'Add existing user to organization as administrator',
                    actionClass: 'at-Button--add',
                    ngClick: 'addUsers()'
                }
            };
            list.listTitle = N_('Admins') + ` | {{ name }}`;
            return list;
        }]
    }
}];

lists.push(OrganizationsJobTemplatesRoute);

export default lists;
