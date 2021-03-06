(function () {
    angular.module('treeGrid', []).directive('treeGrid', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'E',
                //templateUrl:'tree-grid-template.html',
                //template:"<div><table class=\"table table-bordered table-striped tree-grid\"><thead class=\"text-primary\"><tr><th>{{expandingProperty.displayName}}</th><th ng-repeat=\"col in colDefinitions\">{{col.displayName || col.field}}</th></tr></thead><tbody><tr ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\" ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\" class=\"tree-grid-row\"><td class=\"text-primary\"><a ng-click=\"user_clicks_branch(row.branch)\"><i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon\"></i></a><span class=\"indented tree-label\">{{row.branch[expandingProperty.field]}}</span></td><td ng-repeat=\"col in colDefinitions\">{{row.branch[col.field]}}</td></tr></tbody><table></div>" , <td ng-repeat=\"col in colDefinitions\"><span >{{row.branch[col.field]}}</span></td>\
                template: "<div class=\"table-responsive\">\
                  <table class=\"table table-bordered tree-grid\">\
                      <thead class=\"text-primary\">\
                      <tr>\
                          <th width='20%'>Location</th>\
                          <th ng-repeat=\"col in colDefinitions\">{{col.displayName || col.field}}</th>\
                      </tr>\
                      </thead>\
                      <tbody>\
                      <tr ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\"\
                          ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\" class=\"tree-grid-row\">\
                          <td class=\"text-primary\"><a ng-click=\"user_clicks_branch(row.branch)\"><i ng-class=\"row.tree_icon\"\
                                     ng-click=\"row.branch.expanded = !row.branch.expanded\"\
                                     class=\"indented tree-icon\"></i>\
                              </a><span class=\"indented tree-label headercolumn\" ng-click=\"user_clicks_branch(row.branch)\">\
                                {{row.branch[expandingProperty]}}</span>\
                          </td>\
                          <td ng-init=\"datum1 = row.branch.public_storm_signal.split(', ')[1]\" ng-class=\"{pss1: datum1 === 'signal #1', pss2: datum1 === 'signal #2', pss3: datum1 === 'signal #3', pss4: datum1 === 'signal #4', normal: row.branch.public_storm_signal === 'warning uploaded' && !row.branch.expanded}\"><a ng-class=\"{blacktext: row.branch.public_storm_signal}\" ng-show=\"row.branch.public_storm_signal && !row.branch.expanded\">{{row.branch.public_storm_signal}}</a></td>\
                          <td ng-init=\"datum2 = row.branch.gale_warning.split(', ')[1]\" ng-class=\"{pss1: datum2 === 'low risk', pss2: datum2 === 'medium risk', pss3: datum2 === 'high risk', normal: row.branch.gale_warning === true && !row.branch.expanded}\"><a ng-class=\"{blacktext: row.branch.public_storm_signal}\" ng-show=\"row.branch.gale_warning && !row.branch.expanded\">{{row.branch.gale_warning}}</a></td>\
                          <td ng-init=\"datum3 = row.branch.rainfall_advisory.split(', ')[1]\" ng-class=\"{pss1: datum3 === 'low risk', pss2: datum3 === 'medium risk', pss3: datum3 === 'high risk', normal: row.branch.rainfall_advisory === 'warning uploaded' && !row.branch.expanded}\"><a ng-class=\"{blacktext: row.branch.rainfall_advisory}\" ng-show=\"row.branch.rainfall_advisory && !row.branch.expanded\">{{row.branch.rainfall_advisory}}</a></td>\
                          <td ng-init=\"datum4 = row.branch.flooding.split(', ')[1]\" ng-class=\"{pss1: datum4 === 'low risk', pss2: datum4 === 'medium risk', pss3: datum4 === 'high risk', normal: row.branch.flooding === 'warning uploaded' && !row.branch.expanded}\"><a ng-class=\"{blacktext: row.branch.flooding}\" ng-show=\"row.branch.flooding && !row.branch.expanded\">{{row.branch.flooding}}</a></td>\
                          <td ng-init=\"datum5 = row.branch.landslide.split(', ')[1]\" ng-class=\"{pss1: datum5 === 'low risk', pss2: datum5 === 'medium risk', pss3: datum5 === 'high risk', normal: row.branch.landslide === 'warning uploaded' && !row.branch.expanded}\"><a ng-class=\"{blacktext: row.branch.landslide}\" ng-show=\"row.branch.landslide && !row.branch.expanded\">{{row.branch.landslide}}</a></td>\
                          <td ng-init=\"datum6 = row.branch.storm_surge.split(', ')[1]\" ng-class=\"{pss1: datum6 === 'SSA #1', pss2: datum6 === 'SSA #2', pss3: datum6 === 'SSA #3', pss4: datum6 === 'SSA #4', normal: row.branch.storm_surge === 'warning uploaded' && !row.branch.expanded}\"><a ng-class=\"{blacktext: row.branch.storm_surge}\" ng-show=\"row.branch.storm_surge && !row.branch.expanded\">{{row.branch.storm_surge}}</a></td>\
                          <td ng-init=\"datum7 = row.branch.generaladvisory.split(', ')[1]\" ng-class=\"{pss1: datum7 === 'low risk', pss2: datum7 === 'medium risk', pss3: datum7 === 'high risk', normal: row.branch.generaladvisory === 'warning uploaded' && !row.branch.expanded}\"><a ng-class=\"{blacktext: row.branch.generaladvisory}\" ng-show=\"row.branch.generaladvisory && !row.branch.expanded\">{{row.branch.generaladvisory}}</a></td>\
                      </tr>\
                      </tbody>\
                  </table>\
                </div>",
                replace: true,
                scope: {
                    treeData: '=',
                    colDefs: '=',
                    expandOn: '=',
                    onSelect: '&',
                    initialSelection: '@',
                    treeControl: '='
                },
                link: function (scope, element, attrs) {
                    var error, expandingProperty, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree;

                    error = function (s) {
                        console.log('ERROR:' + s);
                        debugger;
                        return void 0;
                    }

                    attrs.iconExpand = attrs.iconExpand ? attrs.iconExpand : 'icon-plus  glyphicon glyphicon-plus  fa fa-plus  icon-plus-squared';
                    attrs.iconCollapse = attrs.iconCollapse ? attrs.iconCollapse : 'icon-minus glyphicon glyphicon-minus fa fa-minus  icon-minus-squared';
                    attrs.iconLeaf = attrs.iconLeaf ? attrs.iconLeaf : 'icon-globe  glyphicon glyphicon-globe  fa fa-globe  icon-location';
                    attrs.expandLevel = attrs.expandLevel ? attrs.expandLevel : '3';
                    expand_level = parseInt(attrs.expandLevel, 10);


                    if (!scope.treeData) {
                        alert('No data was defined for the tree, please define treeData!');
                        return;
                    }
                    //console.log(scope.treeData.length);

                    if (attrs.expandOn) {
                        expandingProperty = scope.expandOn;
                        scope.expandingProperty = scope.expandOn;
                    } else {
                        if(scope.treeData.length) {
                            var _firstRow = scope.treeData[0],
                                _keys = Object.keys(_firstRow);
                            for (var i = 0, len = _keys.length; i < len; i++) {
                                if (typeof (_firstRow[_keys[i]]) === 'string') {
                                    expandingProperty = _keys[i];
                                    break;
                                }
                            }
                            if (!expandingProperty) expandingProperty = _keys[0];
                            scope.expandingProperty = expandingProperty;
                        }
                    }

                    if (!attrs.colDefs) {
                        if(scope.treeData.length) {
                            var _col_defs = [],
                                _firstRow = scope.treeData[0],
                                _unwantedColumn = ['children', 'level', 'expanded', expandingProperty];
                            for (var idx in _firstRow) {
                                if (_unwantedColumn.indexOf(idx) === -1) {
                                    _col_defs.push({
                                        field: idx
                                    });
                                }
                            }
                            scope.colDefinitions = _col_defs;
                        }
                    } else {
                        scope.colDefinitions = scope.colDefs;
                    }

                    for_each_branch = function (f) {
                        var do_f, root_branch, _i, _len, _ref, _results;
                        do_f = function (branch, level) {
                            var child, _i, _len, _ref, _results;
                            f(branch, level);
                            if (branch.children != null) {
                                _ref = branch.children;
                                _results = [];
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    child = _ref[_i];
                                    _results.push(do_f(child, level + 1));
                                }
                                return _results;
                            }
                        };
                        _ref = scope.treeData;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            root_branch = _ref[_i];
                            _results.push(do_f(root_branch, 1));
                        }
                        return _results;
                    };
                    selected_branch = null;
                    select_branch = function (branch) {
                        if (!branch) {
                            if (selected_branch != null) {
                                selected_branch.selected = false;
                            }
                            selected_branch = null;
                            return;
                        }
                        if (branch !== selected_branch) {
                            if (selected_branch != null) {
                                selected_branch.selected = false;
                            }
                            branch.selected = true;
                            selected_branch = branch;
                            expand_all_parents(branch);
                            if (branch.onSelect != null) {
                                return $timeout(function () {
                                    return branch.onSelect(branch);
                                });
                            } else {
                                if (scope.onSelect != null) {
                                    return $timeout(function () {
                                        return scope.onSelect({
                                            branch: branch
                                        });
                                    });
                                }
                            }
                        }
                    };
                    scope.user_clicks_branch = function (branch) {
                        if (branch !== selected_branch) {
                            return select_branch(branch);
                        }
                    };
                    get_parent = function (child) {
                        var parent;
                        parent = void 0;
                        if (child.parent_uid) {
                            for_each_branch(function (b) {
                                if (b.uid === child.parent_uid) {
                                    return parent = b;
                                }
                            });
                        }
                        return parent;
                    };
                    for_all_ancestors = function (child, fn) {
                        var parent;
                        parent = get_parent(child);
                        if (parent != null) {
                            fn(parent);
                            return for_all_ancestors(parent, fn);
                        }
                    };
                    expand_all_parents = function (child) {
                        return for_all_ancestors(child, function (b) {
                            return b.expanded = true;
                        });
                    };

                    scope.tree_rows = [];

                    on_treeData_change = function () {
                        var add_branch_to_list, root_branch, _i, _len, _ref, _results;
                        for_each_branch(function (b, level) {
                            if (!b.uid) {
                                return b.uid = "" + Math.random();
                            }
                        });
                        for_each_branch(function (b) {
                            var child, _i, _len, _ref, _results;
                            if (angular.isArray(b.children)) {
                                _ref = b.children;
                                _results = [];
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    child = _ref[_i];
                                    _results.push(child.parent_uid = b.uid);
                                }
                                return _results;
                            }
                        });
                        scope.tree_rows = [];
                        for_each_branch(function (branch) {
                            var child, f;
                            if (branch.children) {
                                if (branch.children.length > 0) {
                                    f = function (e) {
                                        if (typeof e === 'string') {
                                            return {
                                                label: e,
                                                children: []
                                            };
                                        } else {
                                            return e;
                                        }
                                    };
                                    return branch.children = (function () {
                                        var _i, _len, _ref, _results;
                                        _ref = branch.children;
                                        _results = [];
                                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                            child = _ref[_i];
                                            _results.push(f(child));
                                        }
                                        return _results;
                                    })();
                                }
                            } else {
                                return branch.children = [];
                            }
                        });
                        add_branch_to_list = function (level, branch, visible) {
                            var child, child_visible, tree_icon, _i, _len, _ref, _results;
                            if (branch.expanded == null) {
                                branch.expanded = false;
                            }
                            if (!branch.children || branch.children.length === 0) {
                                tree_icon = attrs.iconLeaf;
                            } else {
                                if (branch.expanded) {
                                    tree_icon = attrs.iconCollapse;
                                } else {
                                    tree_icon = attrs.iconExpand;
                                }
                            }
                            branch.level = level;
                            scope.tree_rows.push({
                                level: level,
                                branch: branch,
                                label: branch[expandingProperty],
                                tree_icon: tree_icon,
                                visible: visible
                            });
                            if (branch.children != null) {
                                _ref = branch.children;
                                _results = [];
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    child = _ref[_i];
                                    child_visible = visible && branch.expanded;
                                    _results.push(add_branch_to_list(level + 1, child, child_visible));
                                }
                                return _results;
                            }
                        };
                        _ref = scope.treeData;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            root_branch = _ref[_i];
                            _results.push(add_branch_to_list(1, root_branch, true));
                        }
                        return _results;
                    };

                    scope.$watch('treeData', on_treeData_change, true);

                    if (attrs.initialSelection != null) {
                        for_each_branch(function (b) {
                            if (b.label === attrs.initialSelection) {
                                return $timeout(function () {
                                    return select_branch(b);
                                });
                            }
                        });
                    }
                    n = scope.treeData.length;
                    for_each_branch(function (b, level) {
                        b.level = level;
                        return b.expanded = b.level < expand_level;
                    });
                    if (scope.treeControl != null) {
                        if (angular.isObject(scope.treeControl)) {
                            tree = scope.treeControl;
                            tree.expand_all = function () {
                                return for_each_branch(function (b, level) {
                                    return b.expanded = true;
                                });
                            };
                            tree.collapse_all = function () {
                                return for_each_branch(function (b, level) {
                                    return b.expanded = false;
                                });
                            };
                            tree.get_first_branch = function () {
                                n = scope.treeData.length;
                                if (n > 0) {
                                    return scope.treeData[0];
                                }
                            };
                            tree.select_first_branch = function () {
                                var b;
                                b = tree.get_first_branch();
                                return tree.select_branch(b);
                            };
                            tree.get_selected_branch = function () {
                                return selected_branch;
                            };
                            tree.get_parent_branch = function (b) {
                                return get_parent(b);
                            };
                            tree.select_branch = function (b) {
                                select_branch(b);
                                return b;
                            };
                            tree.get_children = function (b) {
                                return b.children;
                            };
                            tree.select_parent_branch = function (b) {
                                var p;
                                if (b == null) {
                                    b = tree.get_selected_branch();
                                }
                                if (b != null) {
                                    p = tree.get_parent_branch(b);
                                    if (p != null) {
                                        tree.select_branch(p);
                                        return p;
                                    }
                                }
                            };
                            tree.add_branch = function (parent, new_branch) {
                                if (parent != null) {
                                    parent.children.push(new_branch);
                                    parent.expanded = true;
                                } else {
                                    scope.treeData.push(new_branch);
                                }
                                return new_branch;
                            };
                            tree.add_root_branch = function (new_branch) {
                                tree.add_branch(null, new_branch);
                                return new_branch;
                            };
                            tree.expand_branch = function (b) {
                                if (b == null) {
                                    b = tree.get_selected_branch();
                                }
                                if (b != null) {
                                    b.expanded = true;
                                    return b;
                                }
                            };
                            tree.collapse_branch = function (b) {
                                if (b == null) {
                                    b = selected_branch;
                                }
                                if (b != null) {
                                    b.expanded = false;
                                    return b;
                                }
                            };
                            tree.get_siblings = function (b) {
                                var p, siblings;
                                if (b == null) {
                                    b = selected_branch;
                                }
                                if (b != null) {
                                    p = tree.get_parent_branch(b);
                                    if (p) {
                                        siblings = p.children;
                                    } else {
                                        siblings = scope.treeData;
                                    }
                                    return siblings;
                                }
                            };
                            tree.get_next_sibling = function (b) {
                                var i, siblings;
                                if (b == null) {
                                    b = selected_branch;
                                }
                                if (b != null) {
                                    siblings = tree.get_siblings(b);
                                    n = siblings.length;
                                    i = siblings.indexOf(b);
                                    if (i < n) {
                                        return siblings[i + 1];
                                    }
                                }
                            };
                            tree.get_prev_sibling = function (b) {
                                var i, siblings;
                                if (b == null) {
                                    b = selected_branch;
                                }
                                siblings = tree.get_siblings(b);
                                n = siblings.length;
                                i = siblings.indexOf(b);
                                if (i > 0) {
                                    return siblings[i - 1];
                                }
                            };
                            tree.select_next_sibling = function (b) {
                                var next;
                                if (b == null) {
                                    b = selected_branch;
                                }
                                if (b != null) {
                                    next = tree.get_next_sibling(b);
                                    if (next != null) {
                                        return tree.select_branch(next);
                                    }
                                }
                            };
                            tree.select_prev_sibling = function (b) {
                                var prev;
                                if (b == null) {
                                    b = selected_branch;
                                }
                                if (b != null) {
                                    prev = tree.get_prev_sibling(b);
                                    if (prev != null) {
                                        return tree.select_branch(prev);
                                    }
                                }
                            };
                            tree.get_first_child = function (b) {
                                var _ref;
                                if (b == null) {
                                    b = selected_branch;
                                }
                                if (b != null) {
                                    if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                                        return b.children[0];
                                    }
                                }
                            };
                            tree.get_closest_ancestor_next_sibling = function (b) {
                                var next, parent;
                                next = tree.get_next_sibling(b);
                                if (next != null) {
                                    return next;
                                } else {
                                    parent = tree.get_parent_branch(b);
                                    return tree.get_closest_ancestor_next_sibling(parent);
                                }
                            };
                            tree.get_next_branch = function (b) {
                                var next;
                                if (b == null) {
                                    b = selected_branch;
                                }
                                if (b != null) {
                                    next = tree.get_first_child(b);
                                    if (next != null) {
                                        return next;
                                    } else {
                                        next = tree.get_closest_ancestor_next_sibling(b);
                                        return next;
                                    }
                                }
                            };
                            tree.select_next_branch = function (b) {
                                var next;
                                if (b == null) {
                                    b = selected_branch;
                                }
                                if (b != null) {
                                    next = tree.get_next_branch(b);
                                    if (next != null) {
                                        tree.select_branch(next);
                                        return next;
                                    }
                                }
                            };
                            tree.last_descendant = function (b) {
                                var last_child;
                                if (b == null) {
                                    debugger;
                                }
                                n = b.children.length;
                                if (n === 0) {
                                    return b;
                                } else {
                                    last_child = b.children[n - 1];
                                    return tree.last_descendant(last_child);
                                }
                            };
                            tree.get_prev_branch = function (b) {
                                var parent, prev_sibling;
                                if (b == null) {
                                    b = selected_branch;
                                }
                                if (b != null) {
                                    prev_sibling = tree.get_prev_sibling(b);
                                    if (prev_sibling != null) {
                                        return tree.last_descendant(prev_sibling);
                                    } else {
                                        parent = tree.get_parent_branch(b);
                                        return parent;
                                    }
                                }
                            };
                            return tree.select_prev_branch = function (b) {
                                var prev;
                                if (b == null) {
                                    b = selected_branch;
                                }
                                if (b != null) {
                                    prev = tree.get_prev_branch(b);
                                    if (prev != null) {
                                        tree.select_branch(prev);
                                        return prev;
                                    }
                                }
                            };
                        }
                    }
                }
            };
        }
    ]);

}).call(this);