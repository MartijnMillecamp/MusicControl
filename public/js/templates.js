!function(){var a=Handlebars.template;(Handlebars.templates=Handlebars.templates||{}).artist=a({compiler:[7,">= 4.0.0"],main:function(a,n,l,e,i){var t,s=null!=n?n:a.nullContext||{},d=l.helperMissing,c=a.escapeExpression;return'\n<div class="artistDiv" id='+c((t=null!=(t=l.id||(null!=n?n.id:n))?t:d,"function"==typeof t?t.call(s,{name:"id",hash:{},data:i}):t))+"></div>;\n<div class=\"checkbox\" id='checkbox_'  "+c((t=null!=(t=l.id||(null!=n?n.id:n))?t:d,"function"==typeof t?t.call(s,{name:"id",hash:{},data:i}):t))+' ></div>;\n<div class="artistName"> '+c((t=null!=(t=l.name||(null!=n?n.name:n))?t:d,"function"==typeof t?t.call(s,{name:"name",hash:{},data:i}):t))+" </div>;\n\n"},useData:!0})}();