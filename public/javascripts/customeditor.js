
               var editor = null;
                var data = '';
               var lang ='';
               var themevar ='vs-light';
               var langpick = '';
               var filename = '';
               var fileselected= '';
               var testcaseselected  = '';
               var testcasenode = '';
               var fileincomingpath ='';
               var testincomingpath = '';
               var filesarray = [];              
               function readTextFile(file)
               {
                   console.log(file);
                   var rawFile = new XMLHttpRequest();
                   rawFile.open("GET", file, false);
                   rawFile.onreadystatechange = function ()
                   {
                       if(rawFile.readyState === 4)
                       {
                           if(rawFile.status === 200 || rawFile.status == 0)
                           {
                               var allText = rawFile.responseText;
                               data = allText;
                           }
                       }
                   }
                   rawFile.send(null);
               }
               
              
             
            
               var copied = true;
               var fileistest = true;
               var testfilefromarray;
               var clickonfile = true;
               var BreakException = {};
               var fileException = {};
          


               function compilefile(){
              
                console.log("fileexception")
                   term.send('javac ' +fileselected+' \r');
                   $('#treeview').tree({
                    method: 'get',
                    url: '/getfiles',
                    lines: true,                        
                    animate: true
                   });
                  
              }
        

        function compilefilefortest(){
           
                console.log("breakexception")
                 term.send('javac -cp .:junit-4.12.jar:hamcrest-core-1.3.jar ' +fileselected+' \r');
                 $('#treeview').tree({
                    method: 'get',
                    url: '/getfiles',
                    lines: true,                        
                    animate: true,
                 });
            }
        

           function compile() {
             var arr = document.getElementById('filesArray').value;
             var data = arr.split(',');
             data.forEach(item =>{
                 filesarray.push(item);
             })
          //  var filetype = document.getElementById('filetype').value;
            console.log("button clicked");
            console.log(fileselected);
            // get the value of the data        
           
       
              
                    if(filesarray.includes(fileselected) == true ){       
                        console.log("item matched")                                   
                         
                         compilefilefortest();
                           
                    }else{
                        console.log("item not matched")
                       
                      compilefile()
                    }
               
            

            }
           
       
                    
                
               
            
    
        
    


             function run() {
                
                if(filesarray.includes(fileselected) == true){ 

                    
                    var a = fileselected.split('.') 
                   
                        term.send('java -cp .:junit-4.12.jar:hamcrest-core-1.3.jar org.junit.runner.JUnitCore '+ a[0]+' \r');
                     
                }else{
                    alert("Please select test file only to run!");
                }
              
             }
            
             
            
        
             $(document).ready(function() {
               
                      require.config({ paths: { 'vs': '/build/package/dev/vs'}});
                              require(['vs/editor/editor.main'], function() {
                                  editor = monaco.editor.create(document.getElementById('container'), {
                                  theme : themevar
                         });
                        


                   
                      var MODES = (function() {
                          var modesIds = monaco.languages.getLanguages().map(function(lang) {
                              return lang.id;
                          });
                          modesIds.sort();

                          return modesIds.map(function(modeId) {
                              return {
                                  modeId: modeId,
                                  sampleURL: '/build/index/samples/sample.' + modeId + '.txt'
                              };
                          });
                      })();

                      for (var i = 0; i < MODES.length; i++) {
                          var o = document.createElement('option');
                          o.textContent = MODES[i].modeId;
                          o.value = MODES[i].modeId;
                          $(".language-picker").append(o);
                      }
                    
                      
                      $(".language-picker").change(function() {
                           langpick = MODES[this.selectedIndex]; 
                          loadSample(langpick);
                      });

                      var filepath = document.getElementById('containerpath').value;                     
                      
                  //    fileincomingpath = filepath;
                    //  term.send('cp -a ./public/jarFiles/. '+fileincomingpath+ ' \r')
                    //  term.send('cd '+fileincomingpath+ ' \r');
                        $('#treeview').tree({
                    method: 'get',
                    url: '/files',
                    lines: false, 
                    onClick: function(node){

                        
          //  $("#lblfile").text(node.text);
           // alert(node.id);

            
          }, 
          onDblClick: function(node){
              $("#lblfile").text(node.text);
              $("#addparam").text(node.attributes.path+"/"+node.text);
              console.dir(node,{depth:null})//console.log('node : ' +node);  // alert node text property when clicked

              if(node.file== 0) return false;
              
              addPanel(node.text);

              var filename = node.attributes.path+"/"+node.text;

              $.ajax({
                url: "/read",
                type: "GET",
                data: { name: filename}
              }).done(function( content ) {
                //console.log(content);
              //  editors[node.text].session.setValue( content );
                loadSample2(content);
              });         
          },
          onBeforeExpand: function(node){
          //alert(node.text);  // alert node text property when clicked
          $("#addparam").text(node.attributes.path+"/"+node.text);
        }, 
        onBeforeLoad: function (node,param) { 
          //alert(node.text);
          param.filename=$("#addparam").text(); 
          return true;
        },

      onContextMenu: function(e, node){
    e.preventDefault();   
   $("#lblfile").text(node.text);
		// select the node
    $('#treeview').tree('select', node.target);
    var nam=node.text;
    currentnodepath=node.attributes.path;
   if(nam.match(/[.]{2,}/)==true ||nam.includes(".")!=true)
   {
   $("#addfile").show(); 
   }
   else{
   $("#addfile").hide();
   }
		// display context menu
    // /^.*\.(c|C|java|JAVA|doc|DOC|pdf|PDF)$/
     
		$('#mm').menu('show', {
			left: e.pageX,
			top: e.pageY
    });
	}


      });
                      
                    //   $('#testCase').tree({
                    //     method: 'get',
                    //     url: '/getTest',
                    //     lines: true,
                    //     animate: true, 
                    //     onClick: function(node){
                        
                    //      loadSampleTest(testpath+node.text, node.text);
                    //     testincomingpath = testpath;
                    //     testcaseselected = node.text;
                    //     clickonfile = false;
                         
                          
                    //     }
                    //   });
                      
                   
                    
                    $("#save").click( function(){
                        var value = editor.getValue()

                        $.ajax({
                            method: 'POST',
                            url: '/savefile',
                            data: { name: filename, data:value}
                        }).done(function(response){
                            alert(response)
                        })
                    })
                  
                  });
                
               
    
                
              });
              function loadSample2(pathss) {
               // readTextFile(pathss);
               // fileselected = file;                
            //    filename = langs;           
                    if (!editor) {
                        $('.container').empty();
                        editor = monaco.editor.create(document.getElementById('container'), {
                          
                        });
                    }
                 
                    var oldModel = editor.getModel();
                    var newModel = monaco.editor.createModel(pathss, 'java');                   
                    editor.setModel(newModel);
                    
                    if (oldModel) {
                        oldModel.dispose();
                    }
                   
              

               
            }

            // function loadSampleTest(langs, file) {
            //     readTextFile(langs);   
            // //    testcaseselected= langs;
            //     filename = file;           
            //         if (!editorTest) {
            //             $('.containerTest').empty();
            //             editorTest = monaco.editor.create(document.getElementById('containerTest'), {
                        
            //             });
                       
            //         }
                 
            //         var oldModel = editorTest.getModel();
            //         var newModel = monaco.editor.createModel(data, 'java');
                               
            //         editorTest.setModel(newModel);
            //         editorTest.updateOptions({readOnly : true});
                    
            //         if (oldModel) {
            //             oldModel.dispose();
            //         }
                   
              

               
            // }


              function loadSample(mode) {
                  $.ajax({
                      type: 'GET',
                      url: mode.sampleURL,
                      dataType: 'text'                      
                  }).done(function(data) {
                  
                      if (!editor) {
                          $('.container').empty();
                          editor = monaco.editor.create(document.getElementById('container'), {
                            
                          });
                      }
                   
                      var oldModel = editor.getModel();
                      var newModel = monaco.editor.createModel(data, mode.modeId);
                      lang = mode.modeId;
                      editor.setModel(newModel);
                      
                      if (oldModel) {
                          oldModel.dispose();
                      }
                     
                  });

                 
              }

              
            
              