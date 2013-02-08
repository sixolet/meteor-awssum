# awssum

*[AwsSum](http://awssum.io/) (Amazon Web Services API lib) repackaged for Meteor*

## Example usage

    var amazon = AWSSum.load('amazon/amazon');
    var Ec2 = AWSSum.load('amazon/ec2', 'Ec2');

    var ec2 = new Ec2({
      'accessKeyId' : accessKeyId,
      'secretAccessKey' : secretAccessKey,
      'region' : amazon.US_EAST_1
    });

    Meteor.methods({
      describeInstances: function() {
        return ec2.DescribeInstances();
      }
    });
