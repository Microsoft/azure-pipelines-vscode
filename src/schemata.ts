/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License.
*--------------------------------------------------------------------------------------------*/

const augment = function(base: object, property: string, augmentation: object) : object {
  let baseCopy = JSON.parse(JSON.stringify(base));
  const attachmentPoint = property ? baseCopy[property] : baseCopy;
  for (let commonProp in augmentation) {
    if (attachmentPoint[commonProp] === undefined) {
      attachmentPoint[commonProp] = augmentation[commonProp];
    }
  }
  return baseCopy;
};

const commonVariablesOneOf = [
  {
    "type": "object"
  },
  {
    "type": "array",
    "items": {
      "type": "object",
      "oneOf": [
        {
          "properties": {
            "name": {
              "type": "string"
            },
            "value": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        {
          "properties": {
            "group": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      ]
    }
  }
];

const commonPipelineValues = {
  /* Common pipeline-global values */
  "name": {
    "description": "Pipeline name",
    "type": "string"
  },
  "trigger": {
    "description": "Continuous integration triggers",
    "$ref": "#/definitions/trigger"
  },
  "resources": {
    "description": "Containers and repositories used in the build",
    "$ref": "#/definitions/resources"
  },
  "variables": {
    "oneOf": commonVariablesOneOf,
    "description": "Variables passed into the build"    
  }
  /* End common */
};

const jobLegalAtRoot140 = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "pool": {
      "oneOf": [
        {
          "type": "string"
        },
        {
          "$ref": "#/definitions/pool"
        }
      ],
      "description": "Pool where this job will run"
    },
    "server": {
      "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
      "description": "[DEPRECATED] True if this is an agent-less job (runs on server)"
    },
    "strategy": {
      "$ref": "#/definitions/strategy",
      "description": "Execution strategy for this job"
    },
    "variables": {
      "oneOf": commonVariablesOneOf,
      "description": "Job-specific variables"    
    },
    "steps": {
      "type": "array",
      "description": "A list of steps to run in this job",
      "items": {
        "$ref": "#/definitions/stepOrTemplateExpression"
      }
    },
    "container": {
      "type": "string",
      "description": "Container resource name"
    },
    "workspace": {
      "$ref": "#/definitions/workspace"
    }
  }
};

const jobIllegalAtRoot140 = {
  "job": {
    "oneOf": [
      {
        "type": "string",
        "description": "ID of the job",
        "pattern": "^[_A-Za-z0-9]*$"
      },
      {
        "type": "integer",
        "description": "ID of the job"
      },
      {
        "type": "null"
      }
    ]
  },
  "continueOnError": {
    "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
    "description": "Continue running this job even on failure?"
  },
  "displayName": {
    "type": "string",
    "description": "Human-readable name of the job"
  },
  "condition": {
    "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
    "description": "Evaluate this condition expression to determine whether to run this job"
  },
  "dependsOn": {
    "oneOf": [
      {
        "type": "string"
      },
      {
        "type": "array",
        "items": {
          "type": "string",
          "uniqueItems": true
        }
      }
    ],
    "description": "Any jobs which must complete before this one"
  },
  "timeoutInMinutes": {
    "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
    "description": "Time to wait before cancelling the job"
  },
  "cancelTimeoutInMinutes": {
    "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
    "description": "Time to wait for the job to cancel before forcibly terminating it"
  },
};

const job140 = augment(jobLegalAtRoot140, "properties", jobIllegalAtRoot140);

const jobAtRoot140 = augment(jobLegalAtRoot140, "properties", commonPipelineValues);

const phaseLegalAtRoot140 = {
  "type": "object",
  "additionalProperties": false,
  "description": "[DEPRECATED] Use `job` (inside `jobs`) instead",
  "properties": {
    "queue": {
      "oneOf": [
        {
          "type": "string"
        },
        {
          "$ref": "#/definitions/queue"
        }
      ],
      "description": "[DEPRECATED] Queue where this phase will run"
    },
    "server": {
      "oneOf": [
        {
          "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression"
        },
        {
          "$ref": "#/definitions/legacyServer"
        }
      ],
      "description": "[DEPRECATED] True if this is an agent-less phase (runs on server)"
    },
    "variables": {
      "oneOf": commonVariablesOneOf,
      "description": "Phase-specific variables"    
    },
    "steps": {
      "type": "array",
      "description": "A list of steps to run in this phase",
      "items": {
        "$ref": "#/definitions/stepOrTemplateExpression"
      }
    },
    "parameters": {
      "description": "Parameters used in a pipeline template",
      "type": "object"
    }
  }
};

const phaseIllegalAtRoot140 = {
  "phase": {
    "oneOf": [
      {
        "type": "string",
        "description": "ID of the phase",
        "pattern": "^[_A-Za-z0-9]*$"
      },
      {
        "type": "null"
      }
    ]
  },
  "displayName": {
    "type": "string",
    "description": "Human-readable name of the phase"
  },
  "dependsOn": {
    "oneOf": [
      {
        "type": "string"
      },
      {
        "type": "array",
        "items": {
          "type": "string",
          "uniqueItems": true
        }
      }
    ],
    "description": "Any phases which must complete before this one"
  },
  "condition": {
    "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
    "description": "Evaluate this condition expression to determine whether to run this phase"
  },
  "continueOnError": {
    "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
    "description": "Continue running this phase even on failure?"
  },
  "template": {
    "type": "string",
    "description": "Reference to a template for this phase"
  },
};

const phase140 = augment(phaseLegalAtRoot140, "properties", phaseIllegalAtRoot140);

const phaseAtRoot140 = augment(phaseLegalAtRoot140, "properties", commonPipelineValues);

const stagesAtRoot140 = augment({
  "additionalProperties": false,
  "properties": {
    "stages": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/stage"
      }
    },
    "variables": {
      "oneOf": commonVariablesOneOf,
      "description": "Variables for the entire pipeline"
    }
  }
}, "properties", commonPipelineValues);

const jobsAtRoot140 = augment({
  "additionalProperties": false,
  "required": ["jobs"],
  "properties": {
    "jobs": {
      "description": "Jobs which make up the pipeline",
      "type": "array",
      "items": {
        "oneOf": [
          {
            "$ref": "#/definitions/job"
          },
          {
            "$ref": "#/definitions/templateReference"
          }
        ]
      }
    },
    "variables": {
      "oneOf": commonVariablesOneOf,
      "description": "Variables for this multi-job pipeline"
    }
  }
}, "properties", commonPipelineValues);

const phasesAtRoot140 = augment({
  "additionalProperties": false,
  "required": ["phases"],
  "properties": {
    "phases": {
      "description": "[DEPRECATED] Use `jobs` instead.\n\nPhases which make up the pipeline",
      "type": "array",
      "items": {
        "$ref": "#/definitions/phase"
      }
    },
    "variables": {
      "oneOf": commonVariablesOneOf,
      "description": "Variables for this multi-phase pipeline"
    }
  }
}, "properties", commonPipelineValues);

export const schema140: string = JSON.stringify({
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "https://github.com/Microsoft/azure-pipelines-vscode/blob/master/local-schema.json",
    "$comment": "v1.140.2",
    "title": "Pipeline schema",
    "description": "A pipeline definition",
    "$ref": "#/definitions/pipeline",
    "definitions": {
      "pipeline": {
        "type": "object",
        "anyOf": [
          //{ "$ref": "#/definitions/stagesAtRoot" },
          { "$ref": "#/definitions/jobsAtRoot" },
          { "$ref": "#/definitions/phasesAtRoot" },
          { "$ref": "#/definitions/jobAtRoot" },
          { "$ref": "#/definitions/phaseAtRoot" }
        ]
      },
      "stagesAtRoot": stagesAtRoot140,
      "jobsAtRoot": jobsAtRoot140,
      "phasesAtRoot": phasesAtRoot140,
      "jobAtRoot": jobAtRoot140,
      "phaseAtRoot": phaseAtRoot140,
      "stage": {
        /* Stages aren't implemented fully yet, so this is a placeholder */
        "type": "object",
        "additionalProperties": false
      },
      "job": job140,
      "phase": phase140,
      "resources":
      {
        "oneOf": [
          {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "containers": {
                "description": "List of container images",
                "type": "array",
                "items": {
                  "$ref": "#/definitions/containerReference"
                }
              },
              "repositories": {
                "description": "List of external repositories",
                "type": "array",
                "items": {
                  "$ref": "#/definitions/repositoryReference"
                }
              }
            }
          },
          {
            "type": "array",
            "description": "[DEPRECATED] Use `repositories` or `containers` instead."
          }
        ]
      },
      "pool": {
        "type": "object",
        "description": "Pool details",
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "description": "Name of a pool"
          },
          "vmImage": {
            "description": "For the Azure Pipelines pool, the name of the VM image to use",
            "$ref": "#/definitions/vmImage"
          },
          "demands": {
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            ],
            "description": "List of demands (for a private pool)"
          }
        }
      },
      "queue": {
        "type": "object",
        "description": "[DEPRECATED] Use `pool` (with `jobs`) instead.\n\nQueue details",
        "additionalProperties": false,
        "properties": {
          "name": {
            "type": "string",
            "description": "Name of a queue"
          },
          "demands": {
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            ],
            "description": "List of demands (for a private queue)"
          },
          "timeoutInMinutes": {
            "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
            "description": "Time to wait before cancelling the phase"
          },
          "cancelTimeoutInMinutes": {
            "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
            "description": "Time to wait for the phase to cancel before forcibly terminating it"
          },
          "parallel": {
            "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
            "description": "Maximum number of parallel agent executions"
          },
          "matrix": {
            "$ref": "#/definitions/matrix"
          },
          "container": {
            "type": "string",
            "description": "Container resource name"
          },
          "workspace": {
            "$ref": "#/definitions/workspace"
          }
        }
      },
      "strategy": {
        "type": "object",
        "anyOf": [
          {
            "properties": {
              "matrix": {
                "$ref": "#/definitions/matrix"
              },
              "maxParallel": {
                "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
                "description": "Maximum number of jobs running in parallel"
              }
            },
            "additionalProperties": false,
          },
          {
            "properties": {
              "parallel": {
                "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
                "description": "Run the job this many times"
              },
              "maxParallel": {
                "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
                "description": "Maximum number of jobs running in parallel"
              }
            },
            "additionalProperties": false,
          }
        ]
      },
      "workspace": {
        "description": "Workspace settings",
        "type": "object",
        "properties": {
          "clean": {
            "type": "string",
            "description": "Clean source?"
          }
        }
      },
      "legacyServer": {
        "type": "object",
        "description": "Server job details",
        "additionalProperties": false,
        "properties": {
          "timeoutInMinutes": {
            "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
            "description": "Time to wait before cancelling the job"
          },
          "cancelTimeoutInMinutes": {
            "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
            "description": "Time to wait for the job to cancel before forcibly terminating it"
          },
          "parallel": {
            "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
            "description": "Maximum number of parallel agent executions"
          },
          "matrix": {
            "$ref": "#/definitions/matrix"
          }
        }
      },
      "matrix": {
        "description": "List of permutations of variable values to run",
        "oneOf": [
          {
            "type": "object",
            "minProperties": 1,
            "patternProperties": {
              "^[A-Za-z0-9_]+$": {
                "type": "object",
                "description": "Variable-value pair to pass in this matrix instance"
              }
            }
          },
          {
            "$ref": "#/definitions/runtimeExpression"
          }
        ]
      },
      "script": {
        "type": "object",
        "description": "An inline script step",
        "additionalProperties": false,
        "required": [
          "script"
        ],
        "properties": {
          "script": {
            "type": "string",
            "description": "An inline script"
          },
          "displayName": {
            "type": "string",
            "description": "Human-readable name for the step"
          },
          "name": {
            "type": "string",
            "description": "ID of the step",
            "pattern": "^[_A-Za-z0-9]*$"
          },
          "failOnStderr": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Fail the task if output is sent to Stderr?"
          },
          "workingDirectory": {
            "type": "string",
            "description": "Start the script with this working directory"
          },
          "condition": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Evaluate this condition expression to determine whether to run this script"
          },
          "continueOnError": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Continue running the parent job even on failure?"
          },
          "enabled": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Run this script when the job runs?"
          },
          "timeoutInMinutes": {
            "$ref": "#/definitions/integerTemplateMacroExpression",
            "description": "Time to wait for this script to complete before the server kills it"
          },
          "env": {
            "type": "object",
            "description": "Variables to map into the process's environment"
          }
        }
      },
      "bash": {
        "type": "object",
        "required": [
          "bash"
        ],
        "additionalProperties": false,
        "properties": {
          "bash": {
            "type": "string"
          },
          "displayName": {
            "type": "string",
            "description": "Human-readable name for the step"
          },
          "name": {
            "type": "string",
            "description": "ID of the step",
            "pattern": "^[_A-Za-z0-9]*$"
          },
          "failOnStderr": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Fail the task if output is sent to Stderr?"
          },
          "workingDirectory": {
            "type": "string",
            "description": "Start the script with this working directory"
          },
          "condition": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Evaluate this condition expression to determine whether to run this script"
          },
          "continueOnError": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Continue running the parent job even on failure?"
          },
          "enabled": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Run this script when the job runs?"
          },
          "timeoutInMinutes": {
            "$ref": "#/definitions/integerTemplateMacroExpression",
            "description": "Time to wait for this script to complete before the server kills it"
          },
          "env": {
            "type": "object",
            "description": "Variables to map into the process's environment"
          }
        }
      },
      "powershell": {
        "type": "object",
        "required": [
          "powershell"
        ],
        "additionalProperties": false,
        "properties": {
          "powershell": {
            "type": "string",
            "description": "Inline PowerShell or reference to a PowerShell file"
          },
          "displayName": {
            "type": "string",
            "description": "Human-readable name for the step"
          },
          "name": {
            "type": "string",
            "description": "ID of the step",
            "pattern": "^[_A-Za-z0-9]*$"
          },
          "errorActionPreference": {
            "oneOf": [
              {
                "enum": [
                  "stop",
                  "continue",
                  "silentlyContinue"
                ],
              },
              {
                "$ref": "#/definitions/templateMacroRuntimeExpression"
              }
            ],
            "description": "Strategy for dealing with script errors"
          },
          "failOnStderr": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Fail the task if output is sent to Stderr?"
          },
          "ignoreLASTEXITCODE": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Check the final exit code of the script to determine whether the step succeeded?"
          },
          "workingDirectory": {
            "type": "string",
            "description": "Start the script with this working directory"
          },
          "condition": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Evaluate this condition expression to determine whether to run this script"
          },
          "continueOnError": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Continue running the parent job even on failure?"
          },
          "enabled": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Run this script when the job runs?"
          },
          "timeoutInMinutes": {
            "$ref": "#/definitions/integerTemplateMacroExpression",
            "description": "Time to wait for this script to complete before the server kills it"
          },
          "env": {
            "type": "object",
            "description": "Variables to map into the process's environment"
          }
        }
      },
      "checkout": {
        "type": "object",
        "required": [
          "checkout"
        ],
        "additionalProperties": false,
        "properties": {
          "checkout": {
            "enum": [
              "self",
              "none"
            ],
            "description": "Whether or not to check out the repository containing this pipeline definition"
          },
          "clean": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Start from a clean, freshly-fetched workdir?"
          },
          "fetchDepth": {
            "$ref": "#/definitions/integerTemplateMacroExpression",
            "description": "Depth of Git graph to fetch"
          },
          "lfs": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Fetch Git-LFS objects?"
          },
          "submodules": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Check out Git submodules?"
          },
          "persistCredentials": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Keep credentials available for later use?"
          },
          "condition": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Is this step enabled?"
          }
        }
      },
      "templateReference": {
        "type": "object",
        "required": [
          "template"
        ],
        "additionalProperties": false,
        "properties": {
          "template": {
            "type": "string",
            "description": "A URL to a step template"
          },
          "parameters": {
            "type": "object",
            "description": "Step-specific parameters"
          }
        }
      },
      "repositoryReference": {
        "type": "object",
        "required": [
          "repository"
        ],
        "additionalProperties": false,
        "properties": {
          "repository": {
            "type": "string",
            "description": "ID for the external repository",
            "pattern": "^[A-Za-z0-9_.]+$"
          },
          "type": {
            "enum": [
              "github", "tfsgit", "tfsversioncontrol"
            ],
            "description": "Type of external repository"
          },
          "endpoint": {
            "type": "string",
            "description": "ID of the service endpoint connecting to this repository"
          },
          "name": {
            "type": "string",
            "description": "Identity and repository name",
            "examples": [
              "contoso/foo"
            ]
          },
          "ref": {
            "type": "string",
            "description": "Refname to retrieve",
            "examples": [
              "refs/heads/master",
              "refs/tags/lkg"
            ]
          },
          "clean": {
            "description": "Scorch the repo before fetching?",
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression"
          },
          "fetchDepth": {
            "description": "Depth of Git graph to fetch",
            "$ref": "#/definitions/integerTemplateMacroRuntimeExpression",
          },
          "lfs": {
            "description": "Fetch and checkout Git LFS objects?",
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression"
          },
          "mappings": {
            "description": "Workspace mappings for TFVC",
            "type": "array",
            "items": {
              "$ref": "#/definitions/tfvcMappings"
            }
          },
          "submodules": {
            "description": "Fetch and checkout submodules?",
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression"
          },
          "checkoutOptions": {
            "description": "[DEPRECATED] Move these up a level as peers of the `repository` keyword.",
            "type": "object"
          }
        }
      },
      "containerReference": {
        "type": "object",
        "required": [
          "container",
          "image"
        ],
        "additionalProperties": false,
        "properties": {
          "container": {
            "type": "string",
            "description": "ID for the container",
            "pattern": "^[A-Za-z0-9_]+$"
          },
          "image": {
            "type": "string",
            "description": "Container image tag",
            "examples": [
              "ubuntu:16.04",
              "windows:1803"
            ]
          },
          "endpoint": {
            "type": "string",
            "description": "ID of the service endpoint connecting to a private container registry"
          },
          "options": {
            "type": "string",
            "description": "Options to pass into container host"
          },
          "localImage": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Build the image locally?"
          },
          "env": {
            "type": "object",
            "description": "Variables to map into the container's environment"
          },
          "type": {
            "type": "string",
            "description": "Container type"
          },
          "registry": {
            "type": "string",
            "description": "[DEPRECATED] Don't use"
          }
        }
      },
      "branchFilter": {
        "type": "string",
        /* This only covers illegal single characters, it does not enforce .. or .lock rules */
        "pattern": "^[^\\/~\\^\\: \\[\\]\\*\\\\]+(\\/[^\\/~\\^\\: \\[\\]\\*\\\\]+)*(\\/\\*)?$",
        "description": "branch name or prefix filter"
      },
      "branchFilterArray": {
        "type": "array",
        "items": {
          "$ref": "#/definitions/branchFilter"
        }
      },
      "trigger": {
        "oneOf": [
          {
            "type": "string",
            "pattern": "^none$"
          },
          {
            "$ref": "#/definitions/branchFilterArray"
          },
          {
            "type": "object",
            "properties": {
              "batch": {
                "type": "boolean",
                "description": "Whether to batch changes per branch"
              },
              "branches": {
                "type": "object",
                "properties": {
                  "include": {
                    "$ref": "#/definitions/branchFilterArray"
                  },
                  "exclude": {
                    "$ref": "#/definitions/branchFilterArray"
                  }
                }
              },
              "paths": {
                "type": "object",
                "properties": {
                  "include": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "exclude": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        ]
      },
      "parameters": {
        "type": "object"
      },
      "tfvcMappings": {
        "type": "object",
        "properties": {
          "localPath": {
            "description": "On-disk path",
            "type": "string"
          },
          "serverPath": {
            "description": "TFVC server-side path",
            "type": "string"
          },
          "cloak": {
            "description": "Cloak this path?",
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression"
          },
        }
      },
      "stepOrTemplateExpression": {
        "oneOf": [
          {
            "$ref": "#/definitions/step"
          },
          {
            "$ref": "#/definitions/stepInsertExpression"
          }
        ]
      },
      "step": {
        "oneOf": [
          {
            "$ref": "#/definitions/script"
          },
          {
            "$ref": "#/definitions/bash"
          },
          {
            "$ref": "#/definitions/powershell"
          },
          {
            "$ref": "#/definitions/checkout"
          },
          {
            "$ref": "#/definitions/templateReference"
          },
          {
            "$ref": "#/definitions/task"
          }
        ]
      },
      "booleanTemplateExpression": {
        "oneOf": [
          {
            "type": "boolean"
          },
          {
            "$ref": "#/definitions/templateExpression"
          }
        ]
      },
      "booleanTemplateMacroExpression": {
        "oneOf": [
          {
            "type": "boolean"
          },
          {
            "$ref": "#/definitions/macroExpression"
          },
          {
            "$ref": "#/definitions/templateExpression"
          }
        ]
      },
      "booleanTemplateMacroRuntimeExpression": {
        "oneOf": [
          {
            "type": "boolean"
          },
          {
            "$ref": "#/definitions/runtimeExpression"
          },
          {
            "$ref": "#/definitions/macroExpression"
          },
          {
            "$ref": "#/definitions/templateExpression"
          }
        ]
      },
      "integerTemplateExpression": {
        "oneOf": [
          {
            "type": "integer"
          },
          {
            "$ref": "#/definitions/templateExpression"
          }
        ]
      },
      "integerTemplateMacroExpression": {
        "oneOf": [
          {
            "type": "integer"
          },
          {
            "$ref": "#/definitions/macroExpression"
          },
          {
            "$ref": "#/definitions/templateExpression"
          }
        ]
      },
      "integerTemplateMacroRuntimeExpression": {
        "oneOf": [
          {
            "type": "integer"
          },
          {
            "$ref": "#/definitions/runtimeExpression"
          },
          {
            "$ref": "#/definitions/macroExpression"
          },
          {
            "$ref": "#/definitions/templateExpression"
          }
        ]
      },
      "templateMacroRuntimeExpression": {
        "oneOf": [
          {
            "$ref": "#/definitions/runtimeExpression"
          },
          {
            "$ref": "#/definitions/macroExpression"
          },
          {
            "$ref": "#/definitions/templateExpression"
          }
        ]
      },
      "macroExpression": {
        "type": "string",
        "pattern": "^\\$\\(.*\\)$"
      },
      "runtimeExpression": {
        "type": "string",
        "pattern": "^\\$\\[.*\\]$"
      },
      "templateExpression": {
        "type": "string",
        "pattern": "^\\${{.*}}$"
      },
      "stepInsertExpression": {
        "type": "string",
        "description": "Conditionally insert one or more steps",
        "pattern": "^\\${{.*}}$"
      },
      "task": {
        "type": "object",
        "required": [
          "task"
        ],
        "anyOf": "{{{taskDefinitions}}}",
        "properties": {
          "task": {
            "enum": "{{{taskNames}}}",
            "description": "Task reference including major version"
          },
          "displayName": {
            "type": "string",
            "description": "Human-readable name for the task"
          },
          "name": {
            "type": "string",
            "description": "ID of the task instance",
            "pattern": "^[_A-Za-z0-9]*$"
          },
          "condition": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Evaluate this condition expression to determine whether to run this task"
          },
          "continueOnError": {
            "type": "boolean",
            "description": "Continue running the parent job even on failure?"
          },
          "enabled": {
            "$ref": "#/definitions/booleanTemplateMacroRuntimeExpression",
            "description": "Run this task when the job runs?"
          },
          "timeoutInMinutes": {
            "type": "integer",
            "description": "Time to wait for this task to complete before the server kills it"
          },
          "inputs": {
            "type": "object",
            "description": "Task-specific inputs"
          },
          "env": {
            "type": "object",
            "description": "Variables to map into the process's environment"
          }
        },
        "additionalProperties": false
      },
      "vmImage": {
        "anyOf": [
          {
            "enum": [
              "ubuntu-16.04",
              "vs2015-win2012r2",
              "vs2017-win2016",
              "win1803",
              "macos-10.13"    
            ]
          },
          {
            "type": "string"
          }
        ]
      }
    }
  });
