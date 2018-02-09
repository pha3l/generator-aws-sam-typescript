#!/bin/bash


#TODO: add support for region, s3 bucket, stack-name, and clean up parsing the command.

profile=""



# Parse options to the `cfn-deploy` command
while getopts ":h :p" opt; do
  case ${opt} in
    h )
      echo "Usage:"
      echo "    cfn-deploy -h                               Display this help message."
      echo "    cfn-deploy package [-p <aws-profile>]       Package the template and upload to S3."
      echo "    cnf-deploy deploy [-p <aws-profile>]        Deploy the packaged project."
      exit 0
      ;;
    p )
      echo "-p (profile) argument must come after the subcommand."
      ;;
   \? )
     echo "Invalid Option: -$OPTARG" 1>&2
     exit 1
     ;;
  esac
done
shift $((OPTIND -1))

operation=$1; shift  # Remove 'cfn-deploy' from the argument list

# stackname=$1; shift

while getopts ":p:" opt; do
  case ${opt} in
    p )
      echo "Using AWS Profile: $OPTARG"
      profile=$OPTARG
      ;;
    \? )
      echo "Invalid Option: -$OPTARG" 1>&2
      exit 1
      ;;
    : )
      echo "Invalid Option: -$OPTARG requires an argument" 1>&2
      exit 1
      ;;
  esac
done

package() {
  echo "Generating packaged CloudFormation template and staging to S3..."
  echo "Using $stackname for the stack name"
  aws cloudformation package \
    --template-file template.yaml \
    --s3-bucket $bucketname \
    --capabilities CAPABILITY_IAM
}

deploy() {
  echo "DEPLOY (profile: $profile)";
}

case ${operation} in
  package )
    package
    exit 0
    ;;
  deploy )
    deploy
    exit 0
    ;;
esac

