# Changelog

## [0.5.0](https://github.com/koki-develop/todoist-mcp-server/compare/v0.4.1...v0.5.0) (2025-06-12)


### Features

* add get_tasks_by_filter tool for advanced task filtering ([#56](https://github.com/koki-develop/todoist-mcp-server/issues/56)) ([1cda1ad](https://github.com/koki-develop/todoist-mcp-server/commit/1cda1ad99b8c0c229d9f0fce0606ff991f05f0ad))
* enhance create_task tool with deadlineDate/deadlineLang parameters ([#58](https://github.com/koki-develop/todoist-mcp-server/issues/58)) ([94d1824](https://github.com/koki-develop/todoist-mcp-server/commit/94d18245ff737acde8028e37a9a274e6ceb0a0db))


### Bug Fixes

* correct getTasks parameters to match Todoist SDK ([#57](https://github.com/koki-develop/todoist-mcp-server/issues/57)) ([03b7bb7](https://github.com/koki-develop/todoist-mcp-server/commit/03b7bb7c6e64d44d35dbc627c6c599038dc92b2a))
* remove unnecessary console.error from server startup ([91cf187](https://github.com/koki-develop/todoist-mcp-server/commit/91cf1877d68dff31c435ab538215cc56e78d9604))

## [0.4.1](https://github.com/koki-develop/todoist-mcp-server/compare/v0.4.0...v0.4.1) (2025-06-12)


### Bug Fixes

* Remove quick_add_task tool ([#50](https://github.com/koki-develop/todoist-mcp-server/issues/50)) ([17a3fd7](https://github.com/koki-develop/todoist-mcp-server/commit/17a3fd7e3b6a050e9d57e1ee9c799901c927da06))

## [0.4.0](https://github.com/koki-develop/todoist-mcp-server/compare/v0.3.0...v0.4.0) (2025-06-11)


### Features

* add delete_comment tool for comment removal ([#43](https://github.com/koki-develop/todoist-mcp-server/issues/43)) ([8c77173](https://github.com/koki-develop/todoist-mcp-server/commit/8c7717327e446a65bb847b580a85c957cdb8c1ac))
* add update_comment tool for comment modification ([#45](https://github.com/koki-develop/todoist-mcp-server/issues/45)) ([5ecd667](https://github.com/koki-develop/todoist-mcp-server/commit/5ecd667826ee7a7eaa0f2af7d4962523853cfbb3))
* implement get_project_comments tool for project comment retrieval ([#42](https://github.com/koki-develop/todoist-mcp-server/issues/42)) ([993248f](https://github.com/koki-develop/todoist-mcp-server/commit/993248f01c28dd58131e39cebea70baeebd35015))
* implement move tasks tools for bulk task movement ([#46](https://github.com/koki-develop/todoist-mcp-server/issues/46)) ([e6eb468](https://github.com/koki-develop/todoist-mcp-server/commit/e6eb46846c617ec26004e33b66b364725c33ac59))
* separate create_comment into task and project specific tools ([#47](https://github.com/koki-develop/todoist-mcp-server/issues/47)) ([a96f65d](https://github.com/koki-develop/todoist-mcp-server/commit/a96f65d50bb496be40be739174807a929e0c324c))

## [0.3.0](https://github.com/koki-develop/todoist-mcp-server/compare/v0.2.0...v0.3.0) (2025-06-11)


### Features

* implement create_comment tool for task and project comments ([#37](https://github.com/koki-develop/todoist-mcp-server/issues/37)) ([b215bea](https://github.com/koki-develop/todoist-mcp-server/commit/b215beaa30229f3c97d338f6703db6284f25f88f))
* implement get_task_comments tool for task comment retrieval ([#40](https://github.com/koki-develop/todoist-mcp-server/issues/40)) ([b0ffe50](https://github.com/koki-develop/todoist-mcp-server/commit/b0ffe502f86ac9edf99d194b8614f910e3a9ec07))
* implement quick_add_task tool for natural language task creation ([#38](https://github.com/koki-develop/todoist-mcp-server/issues/38)) ([df41ab6](https://github.com/koki-develop/todoist-mcp-server/commit/df41ab6fbbb9aa4b384b479bbf5b8391b2d57733))


### Bug Fixes

* add missing org.opencontainers.image.description label to Dockerfile ([#41](https://github.com/koki-develop/todoist-mcp-server/issues/41)) ([11e27c2](https://github.com/koki-develop/todoist-mcp-server/commit/11e27c2f4e5c415ecd15fead40251c7d31dd9b5d))

## [0.2.0](https://github.com/koki-develop/todoist-mcp-server/compare/v0.1.0...v0.2.0) (2025-06-10)


### Features

* add create_label tool for personal label management ([#31](https://github.com/koki-develop/todoist-mcp-server/issues/31)) ([ccc3361](https://github.com/koki-develop/todoist-mcp-server/commit/ccc3361a006344bcbf69fb59b53442e9f631fbd6))
* add update_label tool for label modification ([#36](https://github.com/koki-develop/todoist-mcp-server/issues/36)) ([b91de14](https://github.com/koki-develop/todoist-mcp-server/commit/b91de14f2d9f855d14c8beaf86c8367667b7c256))
* implement delete_label tool for label removal ([#35](https://github.com/koki-develop/todoist-mcp-server/issues/35)) ([de271c3](https://github.com/koki-develop/todoist-mcp-server/commit/de271c3313379423f356422735b368fdf65f9396))
* implement get_label tool for individual label retrieval ([#34](https://github.com/koki-develop/todoist-mcp-server/issues/34)) ([e33b699](https://github.com/koki-develop/todoist-mcp-server/commit/e33b699daf7889a8319396319b5dcf3587928cdf))
* implement get_labels tool for personal label management ([#33](https://github.com/koki-develop/todoist-mcp-server/issues/33)) ([a68a5cd](https://github.com/koki-develop/todoist-mcp-server/commit/a68a5cdb8b9f17043303ccf9c71f36d60d149fa4))

## [0.1.0](https://github.com/koki-develop/todoist-mcp-server/compare/v0.0.3...v0.1.0) (2025-06-10)


### Features

* add comprehensive section management support ([#18](https://github.com/koki-develop/todoist-mcp-server/issues/18)) ([4958103](https://github.com/koki-develop/todoist-mcp-server/commit/495810301d4f8b3c77cf69f49d52d845f44fb349))
* implement comprehensive task management features ([#9](https://github.com/koki-develop/todoist-mcp-server/issues/9)) ([cc77bd9](https://github.com/koki-develop/todoist-mcp-server/commit/cc77bd938ac203d9fde31125c5d9afdee1770656))
* migrate MCP resources to tools for improved client compatibility ([#17](https://github.com/koki-develop/todoist-mcp-server/issues/17)) ([edc985b](https://github.com/koki-develop/todoist-mcp-server/commit/edc985b8f9f5c8004ec5797dbc57cb6c4b7ff003))

## [0.0.3](https://github.com/koki-develop/todoist-mcp-server/compare/v0.0.2...v0.0.3) (2025-06-08)


### Bug Fixes

* add multi-platform Docker support for ARM64 and AMD64 ([#10](https://github.com/koki-develop/todoist-mcp-server/issues/10)) ([f90071b](https://github.com/koki-develop/todoist-mcp-server/commit/f90071bfe7a3b7155858fb0de3645585529836d0))

## 0.0.2 (2025-06-08)


### Features

* implement basic MCP server structure ([e052e3d](https://github.com/koki-develop/todoist-mcp-server/commit/e052e3d91dea4fb3fdc284b62ce6c12050040fb9))
* implement comprehensive project management tools for MCP server ([#1](https://github.com/koki-develop/todoist-mcp-server/issues/1)) ([4507efa](https://github.com/koki-develop/todoist-mcp-server/commit/4507efaceaf822fdeb19a3178af355721dfa2dda))
* trigger initial release ([54ab578](https://github.com/koki-develop/todoist-mcp-server/commit/54ab5781aed15242ba69be76018dc6adea4e1b8c))
