function botValidate(id){
	  $(id).bootstrapValidator({
		  	message: 'This value is not valid',
		  	feedbackIcons: {
		  		valid: 'glyphicon glyphicon-ok',
		  		invalid: 'glyphicon glyphicon-remove',
		  		validating: 'glyphicon glyphicon-refresh'
		  	},
		  	fields: {
		  		name: {
		  			validators: {
		  				notEmpty: {
		  					message: '请输入名称'
		  				}
		  			}
		  		},
		  		description: {
		  			validators: {
		  				notEmpty: {
		  					message: '请输入备注'
		  				}
		  			}
		  		}
		  	}
		  });
}