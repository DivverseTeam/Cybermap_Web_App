const getComplianceDetailsByConfigRuleResponse = [
  {
    ruleName: "IAM_USER_MFA_ENABLED",
    evaluations: [
      {
        ComplianceType: "COMPLIANT",
        EvaluationResultIdentifier: {
          EvaluationResultQualifier: {
            ResourceId: "user1",
            ResourceType: "AWS::IAM::User",
          },
        },
        Annotation: "MFA is enabled for this user.",
      },
      {
        ComplianceType: "NON_COMPLIANT",
        EvaluationResultIdentifier: {
          EvaluationResultQualifier: {
            ResourceId: "user2",
            ResourceType: "AWS::IAM::User",
          },
        },
        Annotation: "MFA is not enabled for this user.",
      },
    ],
  },
  {
    ruleName: "S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED",
    evaluations: [
      {
        ComplianceType: "COMPLIANT",
        EvaluationResultIdentifier: {
          EvaluationResultQualifier: {
            ResourceId: "bucket1",
            ResourceType: "AWS::S3::Bucket",
          },
        },
        Annotation: "Server-side encryption is enabled.",
      },
      {
        ComplianceType: "NON_COMPLIANT",
        EvaluationResultIdentifier: {
          EvaluationResultQualifier: {
            ResourceId: "bucket2",
            ResourceType: "AWS::S3::Bucket",
          },
        },
        Annotation: "Server-side encryption is not enabled.",
      },
    ],
  },
  {
    ruleName: "ENCRYPTED_VOLUMES",
    evaluations: [
      {
        ComplianceType: "COMPLIANT",
        EvaluationResultIdentifier: {
          EvaluationResultQualifier: {
            ResourceId: "volume1",
            ResourceType: "AWS::EC2::Volume",
          },
        },
        Annotation: "The volume is encrypted.",
      },
      {
        ComplianceType: "NON_COMPLIANT",
        EvaluationResultIdentifier: {
          EvaluationResultQualifier: {
            ResourceId: "volume2",
            ResourceType: "AWS::EC2::Volume",
          },
        },
        Annotation: "The volume is not encrypted.",
      },
    ],
  },
  {
    ruleName: "VPC_FLOW_LOGS_ENABLED",
    evaluations: [
      {
        ComplianceType: "COMPLIANT",
        EvaluationResultIdentifier: {
          EvaluationResultQualifier: {
            ResourceId: "vpc1",
            ResourceType: "AWS::EC2::VPC",
          },
        },
        Annotation: "VPC Flow Logs are enabled.",
      },
      {
        ComplianceType: "NON_COMPLIANT",
        EvaluationResultIdentifier: {
          EvaluationResultQualifier: {
            ResourceId: "vpc2",
            ResourceType: "AWS::EC2::VPC",
          },
        },
        Annotation: "VPC Flow Logs are not enabled.",
      },
    ],
  },
  {
    ruleName: "INCOMING_SSH_DISABLED",
    evaluations: [
      {
        ComplianceType: "COMPLIANT",
        EvaluationResultIdentifier: {
          EvaluationResultQualifier: {
            ResourceId: "sg-12345",
            ResourceType: "AWS::EC2::SecurityGroup",
          },
        },
        Annotation: "No unrestricted SSH access detected.",
      },
      {
        ComplianceType: "NON_COMPLIANT",
        EvaluationResultIdentifier: {
          EvaluationResultQualifier: {
            ResourceId: "sg-67890",
            ResourceType: "AWS::EC2::SecurityGroup",
          },
        },
        Annotation: "Unrestricted SSH access detected.",
      },
    ],
  },
];

const getAllConfigRulesResponse = [
  {
    ConfigRuleName: "IAM_USER_MFA_ENABLED",
    ConfigRuleArn:
      "arn:aws:config:region:account-id:config-rule/config-rule-id",
    Description: "Checks whether IAM users have MFA enabled.",
    Scope: {
      ComplianceResourceTypes: ["AWS::IAM::User"],
    },
    Source: {
      Owner: "AWS",
      SourceIdentifier: "IAM_USER_MFA_ENABLED",
    },
  },
  {
    ConfigRuleName: "S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED",
    ConfigRuleArn:
      "arn:aws:config:region:account-id:config-rule/config-rule-id",
    Description:
      "Checks whether S3 buckets have server-side encryption enabled.",
    Scope: {
      ComplianceResourceTypes: ["AWS::S3::Bucket"],
    },
    Source: {
      Owner: "AWS",
      SourceIdentifier: "S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED",
    },
  },
];

export { getAllConfigRulesResponse, getComplianceDetailsByConfigRuleResponse };
