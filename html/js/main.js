var SIGN_API = 'https://awa81j9141.execute-api.us-west-2.amazonaws.com/dev/uploads/sign';

$(document).ready(function() {

    $('#file-form').fileupload({
        autoUpload: false,
        type: 'PUT',
        multipart: false,
        beforeSend: function(xhr, data) {
            // Prevent the Content-Disposition header being populated during the uploading of the file.
            // This is necessary to prevent filename and attachment being set (which forces the file to be downloaded when clicked on)
            xhr.setRequestHeader('Content-Disposition', '');
        },
        limitConcurrentUploads: 1,
        add: function(e, data) {

            // Get the signed URL from our Lambda-backed API Gateway
            $.post(SIGN_API, JSON.stringify({
                contentType: data.files[0].type
            }), function(result) {

                // Check there wasn't an error getting the signed URL
                if (!result.errorMessage) {

                    // Set the upload URL with our new signed URL
                    data.url = result.oneTimeUploadUrl;
                    data.contentType = data.files[0].type;

                    // Hijack the data object so we can re-use resultURL later
                    data.resultUrl = result.resultUrl;

                    // Upload the file to the new signed URL
                    data.submit();
                } else {

                    // Print that error if there was an error getting the signed URL
                    alert(result.errorMessage);
                }
            }, 'json');
        },
        progressall: function(e, data) {

            // Show progress of the upload by extending the progress bar as we go.
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css('width', progress + '%');
        },
        done: function(e, data) {

            // Show preview image
            $('#output img').replaceWith('<img src="' + data.resultUrl + '" class="preview"/>');
            // Populate output URL textbox
            $('#output-url').css('display', 'block').attr('value', data.resultUrl);
        }
    });
});

var s3UploadApp = angular.module('s3UploadApp', ['ngFileUpload']);

s3UploadApp.controller('fileUploadController', ['$scope', 'Upload', '$http', function($scope, Upload, $http) {

    // upload on file select or drop
    $scope.upload = function(file) {
        $http.post(SIGN_API, JSON.stringify({
                contentType: file.type
            }))
            .success(function(response) {
                Upload.http({
                    url: response.oneTimeUploadUrl,
                    method: 'PUT',
                    headers: {
                        'Content-Type': file.type
                    },
                    data: file
                }).then(function(resp) {
                    // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp);
                    $scope.resultImg = response.resultUrl;
                    $scope.outputUrl = response.resultUrl;
                }, function(resp) {
                    console.log('Error status: ' + resp.status);
                }, function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.progress = progressPercentage;
                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            });
    };
}]);
