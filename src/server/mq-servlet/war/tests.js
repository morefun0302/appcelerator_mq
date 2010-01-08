window.onload = function(){
  //===========================
  //UNIT TEST DEFINITION
  //===========================
  var unit_tests = [ 
    {
      name: "Core API - Extend Function",
      unit_test: function() {
        var defaultsSet = false;
        var defaultOverridden = false;
        var objectExtended = false;
        
        var toExtend = {
          value2:"override",
          value3:true
        };
        
        var extended = mq.extend({
          value1:"value1",
          value2:"value2"
        },toExtend);
        
        if (extended.value1 === "value1") {
          defaultsSet = true;
        }
        if (extended.value2 === "override") {
          defaultOverridden = true;
        }
        if (extended.value3) {
          objectExtended = true;
        }
        
        assert(defaultsSet,"Object defaults set properly.");
        assert(defaultOverridden,"Object default overridden properly.");
        assert(objectExtended,"Object extended with additional values.");
        done();
      }
    },
    {
      name: "XMLHttpRequest test - <a href='http://code.google.com/p/xmlhttprequest'>Source</a>",
      unit_test: function() {
        warn("Need to implement some tests");
        done();
        
        /*setTimeout(function() {
          assert(htmlFetched,"GET request retrieved HTML.");
          done();
        },500);*/
      }
    },
    {
      name: "JSON API Tests",
      unit_test: function() {
        var toStringGood = false;
        var parseGood = false;
        
        var tostring = { foo: "bar", foo2: [{foo3:true}] };
        var json = mq.JSON.stringify(tostring);
        toStringGood = json === '{"foo":"bar","foo2":[{"foo3":true}]}';
        
        var fromstring = mq.JSON.parse(json);
        if (fromstring.foo === "bar" && fromstring.foo2[0].foo3) {
          parseGood = true;
        }
        
        assert(toStringGood,"JSON.stringify looking good.");
        assert(parseGood,"JSON.parse looking good.");
        done();
      }
    },
    {
      name: "MQ API - Direct Publish and Subscribe",
      unit_test: function() {
        var matchWorked = false;
        var noMatchWorked = true;
        
        mq.sub("test1", function(message) {
          matchWorked = true;
        });
        
        mq.sub("testXXXXXX", function(message) {
          noMatchWorked = false;
        });
        
        mq.pub("test1");
        
        setTimeout(function() {
          assert(matchWorked, "Direct subscribe worked.");
          assert(noMatchWorked, "Direct subscribe does not catch all.");
          done();
        },333);
      }
    },
    {
      name: "MQ API - RegExp Subscribe",
      unit_test: function() {
        var matchWorked = false;
        var noMatchWorked = true;
        
        mq.sub(/test.*/, function(message) {
          matchWorked = true;
        });
        
        mq.sub(/fest.*/, function(message) {
          noMatchWorked = false;
        });
        
        mq.pub("testregex");
        
        setTimeout(function() {
          assert(matchWorked, "RegExp subscribe worked");
          assert(noMatchWorked, "Non-matching RegExp not matched");
          done();
        },333);
      }
    },
    {
      name: "MQ API - Using payloads",
      unit_test: function() {
        var deilvered = false;
        
        mq.sub("test.payload", function(message) {
          delivered = message.payload.foo;
        });
        
        mq.pub("test.payload", {foo:true});
        
        setTimeout(function() {
          assert(delivered, "Payload sent and received.");
          done();
        },333);
      }
    },
    {
      name: "MQ API - Using scopes",
      unit_test: function() {
        var scopeWorked = false;
        var noScopeWorked = true;
        
        mq.sub("test.scope", function(message) {
          scopeWorked = true;
        },{scope:"myscope"});
        
        mq.sub("test.scope", function(message) {
          noScopeWorked = false;
        });
        
        mq.pub("test.scope", {}, {scope:"myscope"});
        
        setTimeout(function() {
          assert(scopeWorked, "Scoped message received.");
          assert(noScopeWorked, "Scoped message NOT received.");
          done();
        },333);
      }
    },
    {
      name: "MQ API - Testing unsubscribe",
      unit_test: function() {
        var unsubbed = true;
        
        var listener = mq.sub("unsub", function(message) {
          unsubbed = false;
        });
        
        mq.unsub(listener);
        
        mq.pub("unsub");
        
        setTimeout(function() {
          assert(unsubbed, "Message Unsubscribed Successfully.");
          done();
        },333);
      }
    },
    {
      name: "MQ API - Testing filters",
      unit_test: function() {
        var filteredDirect = false;
        var filteredRegExp = false;
        
        mq.filter("filter1", function(message) {
          message.payload.direct = true;
        });
        
        mq.filter(/filter.*/, function(message) {
          message.payload.regexp = true;
        });
        
        mq.sub("filter1", function(message) {
          filteredDirect = message.payload.direct;
          filteredRegExp = message.payload.regexp;
        });

        mq.pub("filter1"); 
               
        setTimeout(function() {
          assert(filteredDirect, "Direct filter applied");
          assert(filteredRegExp, "RegExp filter applied");
          done();
        },333);
      }
    },
    {
      name: "MQ API - Testing filter scopes",
      unit_test: function() {
        var scopeWorked = false;
        var noScopeWorked = true;
        
        mq.filter("filterScope", function(message) {
          scopeWorked = true;
        },{scope:"myscope"});
        
        mq.filter("filterScope", function(message) {
          noScopeWorked = false;
        });

        mq.pub("filterScope",{},{scope:"myscope"}); 
               
        setTimeout(function() {
          assert(scopeWorked, "Filter scope worked");
          assert(noScopeWorked, "Out of scope filter not applied");
          done();
        },333);
      }
    },
    {
      name: "MQ API - Testing unfilter",
      unit_test: function() {
        var filtered = false;
        
        var filter = mq.filter("unfilter", function(message) {
          filtered = true;
        });
        
        mq.unfilter(filter);
        
        mq.pub("unfilter");
        
        setTimeout(function() {
          assert(!filtered, "Filter removed successfully.");
          done();
        },333);
      }
    },
    {
      name: "MQ API - Configure queue scan interval",
      unit_test: function() {
        var delivered = false;
        
        mq.config.scan_interval = 3000;
        
        setTimeout(function() {
          mq.sub("slowscan", function(message) {
            delivered = true;
          });
          mq.pub("slowscan");
        },500);
        
        setTimeout(function() {
          assert(!delivered, "Message should NOT have been delivered yet");
        },1000);
        
        setTimeout(function() {
          assert(delivered, "Message Queue scan interval configured successfully");
          mq.config.scan_interval = 150;
          done();
        },4000);
      }
    },
    {
      name: "Remote Messages - Test Hello World",
      unit_test: function() {
        var receivedWithPayload = false;
        var scopeWorked = true;
        
        //Should receive response
        mq.sub("r:say.hello.response",function(msg) {
          alert('gotit!');
          if (msg.payload == "Hello World!") {
            receivedWithPayload = true;
          }
        });
        
        //Should NOT receive response due to scope
        mq.sub("r:say.hello.response",function(msg) {
          scopeWorked = false;
        },{
          scope:"myscope"
        });
        
        //Send remote message
        mq.pub("r:say.hello.request");
        
        //Test after we've had some time to get a response
        setTimeout(function() {
          assert(receivedWithPayload, "Remote response received with proper payload.");
          assert(scopeWorked, "Remote response has proper default scope assigned");
          done();
        },3000);
      }
    }
  ];
  //===========================
  //END UNIT TESTS
  //===========================
  
  
  //---------------------------
  //Test harness implementation
  //---------------------------  
  var tests_executed = 0; 
  var assertions = 0;
  var successes = 0;
  var failures = 0;
  var warnings = 0;
  var executing = false;
  
  //print status message
  function status(message) {
    var inner = document.getElementById("resultlist").innerHTML;
    inner = inner+"<li class='status'>"+message+"</li>";
    document.getElementById("resultlist").innerHTML = inner;
  }
  
  //print failure
  function fail(message) {
    assertions=assertions+1;
    failures=failures+1;
    var inner = document.getElementById("resultlist").innerHTML;
    inner = inner+"<li class='failure'>"+message+"</li>";
    document.getElementById("resultlist").innerHTML = inner;
  }
  
  //print warning
  function warn(message) {
    warnings=warnings+1;
    var inner = document.getElementById("resultlist").innerHTML;
    inner = inner+"<li class='warn'>"+message+"</li>";
    document.getElementById("resultlist").innerHTML = inner;
  }
  
  //print success
  function success(message) {
    assertions++;
    successes++;
    var inner = document.getElementById("resultlist").innerHTML;
    inner = inner+"<li class='success'>"+message+"</li>";
    document.getElementById("resultlist").innerHTML = inner;
  }
  
  //assert a test condition, and display feedback
  function assert(value,description) {    
    if (value) {
      success(description);
    }
    else {
      fail("Assertion Failed: "+description);
    }
  }
  
  //end current test
  function done() {
    executing = false;
  }
  
  //print summary
  function end() {
    var inner = "<h3 class='summary'>Test Suite Summary:</h3>"+
      "<div class='summary'>"+
      tests_executed+ " tests ("+
      assertions+" assertions) completed with <span class='success'>"+
      successes+" successes</span>, <span class='warn'>"+ 
      warnings+" warnings</span>, and <span class='failure'>"+
      failures+" failures</span>. <br/><br/>  Have a nice day!</div>";
    document.getElementById("status").innerHTML = inner;
  }  
  
  //Start running through tests
  var timer = setInterval(function() {
    if (unit_tests.length == 0 && !executing) {
      clearInterval(timer);
      end();
    }
    if (!executing && unit_tests.length > 0) {
      executing = true;
      var tst = unit_tests.shift();
      status("Executing test: '"+ tst.name +"'...");
      tst.unit_test.call({});
      tests_executed++;
    }
  },10);
  
};