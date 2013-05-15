var datasets_obj={"datapublishers":{"ids":[],"names":[]},
                 "datasets": []
                  };

function get_dataset_name (id)
{
return $('#datapublishers_list-dropdown').find('#'+id).text()
}

function get_dataset_id (text)
{
//return $("#datapublishers_list-dropdown:contains('"+text+"').find('#'+id).text()

}
var datapub_datasets={"1":[1,2,3,4,5,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],"2":[34,35,36,37,38,39,40,41,42,43,44,45],"3":[46],"4":[47,48,49,50],"5":[51],"6":[52],"7":[53],"8":[54],"9":[55],"10":[56],"11":[57],"12":[58],"13":[59],"14":[60],"15":[61],"16":[62,63,64],"17":[65,66,67],"18":[68],"19":[69],"20":[70],"22":[71,72,73],"23":[74],"24":[75],"25":[76],"26":[77],"27":[78],"28":[79],"29":[80],"30":[81],"31":[82],"32":[83,84,85],"33":[86,87]};
//"21":[1], ???

function get_datapub_id (dataset_id)
{
var datapub_id;
console.info(dataset_id)
for (var dp_id in datapub_datasets)
     {

     var x=datapub_datasets[dp_id]
     console.info(datapub_datasets[dp_id])
     if (x.indexOf(dataset_id)!==-1)
     {
      datapub_id=dp_id;
      
      }
     }
     return datapub_id;
}

     function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function addSeparator(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}

function collect_params_from_url(taxes,places,datasets_text)
{

if (taxes!=='')
{
taxes_array=taxes.split(';');

var lis='';
for (var i = taxes_array.length - 1; i >= 0; i--) 
{

   lis+='<li><i class="icon-remove" style="color:#9C0890;float:left;"></i><b>'+taxes_array[i]+'</b></li>';  
};


$('#taxa-dropdown ul').append(lis)

var count=$('#taxa-dropdown li').size()

$('#taxa-dropdown-trigger').html('Taxas  <span class="badge_mini badge-success">'+count+'</span>')


}

// for (dataset_json as dataset)
// {
//     if (dataset==this_dataset)
//     {
//         console.log(dataset_json[dataset].datapublisher_id)
//     }
// }

//var text="Inventaire National du Patrimoine Naturel (I206) : CBN Aquitaine-Poitou-Charentes"

function get_dataset_id (text)
{
//   var to_search="#datapublishers_list-dropdown li:contains('"+text+"')"
// console.warn(to_search);
// console.info($(to_search).attr('id'));

//   return $(to_search).attr('id');
for (var dataset in dataset_json)
{
var this_dataset=dataset_json[dataset];
console.info(this_dataset.dataset_name+' and value is <br>'+text)
if (this_dataset.dataset_name==text)
{
console.warn(this_dataset.dataset_name+' and value is <br>'+text)
return dataset;
}

}

}
if (datasets_text!='')
{
var datasets_array=datasets_text.split(';');
var lis='';
for (var i = datasets_array.length - 1; i >= 0; i--) 
{
  lis+='<li id="dataset_'+get_dataset_id(datasets_array[i])+'"><i class="icon-remove" style="color:#9C0890;float:left;"></i><b>'+datasets_array[i]+'</b></li>';  
};
$('#datapublishers-dropdown ul').append(lis)

var count=$('#datapublishers-dropdown li').size()

$('#datapublishers-dropdown-trigger').html('Datasets  <span class="badge_mini badge-success">'+count+'</span>')

}

if (places!='')
{
places_array=places.split(';');
var lis='';
for (var i = places_array.length - 1; i >= 0; i--) 
{

   lis+='<li><i class="icon-remove" style="color:#9C0890;float:left;"></i><b>'+places_array[i]+'</b></li>';  
};


$('#places-dropdown ul').append(lis);

var count=$('#places-dropdown li').size()

$('#places-dropdown-trigger').html('Places  <span class="badge_mini badge-success">'+count+'</span>')

}
}


jQuery(document).ready(function($) {

$('#layers_manager label').live('click',function (e)
{
var action=$(e.target).attr('action')
var taxa_id=parseInt($(this).attr('id'))
switch (action)
{
case 'remove_occ':

   d3.selectAll('path').filter(function (d)
            {
             return d.random_id==taxa_id
            }).remove();
            //attr('opacity',0)
   $(this).remove()
break;


case 'hide_occ':

   d3.selectAll('path').filter(function (d)
            {
             return d.random_id==taxa_id
            }).attr('opacity',0)

      $(e.target).html('<span action="show_occ">   Show   </span>')
break;

case 'show_occ':

   d3.selectAll('path').filter(function (d)
            {
             return d.random_id==taxa_id
            }).attr('opacity',0.8)

      $(e.target).html('<span action="hide_occ">   Hide   </span>')
break;
default: return false;
break;

/*
case 'highlight_occ':

   d3.selectAll('path').filter(function (d)
            {
             return d.random_id==taxa_id
            }).attr('opacity',0.8)

      $(e.target).html('<span action="hide_occ">   Hide   </span>')
break;
*/
}

})

$('#search-submit').click(function ()
{

/*
for (var dp_id in datasets_obj.datasets)
{
var this_datasets=datasets_obj.datasets[dp_id]

d_to_pass.push({'datapublisher': dp_id, 'datasets': this_datasets.ids}); 

}
console.dir(d_to_pass)
*/
  var $taxes=$('#taxa-dropdown li')

  if ($taxes.length>0)
  {
  var taxes_arr=$('#taxa-dropdown li').map(function()
   {   
   return jQuery(this).find('b').eq(0).text()   
   }).get().join(';')
  }
  else
  {
    var taxes_arr='';
  }
   $('#input-search-taxa').val(taxes_arr)

 // places_arr=$('#places-dropdown li').map(function()
 //   {   
 //   return jQuery(this).find('b').eq(0).text()   
 //   }).get().join(';')
    var bbox_string='';
    if (typeof(rect_bbox)!=='undefined')
    {
        for (index in rect_bbox)
     {
      bbox_string+=rect_bbox[index].toString()+';';

     };
    }
   
  
  var $places=$('#places-dropdown li')

  if ($places.length>0)
  {
     var places_arr= $('#places-dropdown li').map(function()
   {
   var place=$(this).find('b').eq(0).text().split(',')[0];
   var bbox=$(this).find(' .bbox_handler').text()
   
   return place;//+';['+bbox+']';  
   
   }).get().join(';');//+';'+bbox_string;
  }
  else
  {
    var places_arr='';
  }

  $('#input-search-place').val(places_arr)

  datapubs_arr=$('#datapublishers-dropdown li').map(function()
   {   
   return jQuery(this).find('b').eq(0).text()   
   }).get().join(';')
  
 $('#input-search-dataset').val(datapubs_arr)


 })

$('#show_extra').click(function ()
{
var $this=$(this)
if ($this.hasClass('hidden'))
{
$('#extra_outils').show()
$this.removeClass('hidden').text('Hide extra tools')  
}
else
{
  $('#extra_outils').hide()
$this.text('Show extra tools').addClass('hidden')
}

})

$('.wax-tooltip .icon-remove').live('click',function()
{
  $(this).parent().hide()
})

$('.popover').live('click',function (e)
{
var $this=$(this) 

var $target=$(e.target)

if ($target.hasClass('icon-remove'))
{
  $this.hide();
}
})
$('#layers_manager li').click(function (e)
{
  var $target=$(e.target)
  switch ($target.attr('id'))
  {
    case 'hide_paths':

    var $my_paths=$('#map path')
    
    if ($(this).hasClass('hide_it'))
          {         
          $my_paths.hide();
          $(this).text('Hide degree cells search')
           .removeClass('hide_it')
        }
        else
        {
          
           $my_paths.show();
           $(this).text('Show degree cells search')
           .addClass('hide_it')
         } 

    break;

    case 'hide_points':
    
    if ($(this).hasClass('hide_it'))
          {
         console.warn(this_datapublisher)
          this_datapublisher.setOpacity(0)
          $(this).text('Show points layer')
           .removeClass('hide_it')
        }
        else
        {
          
           this_datapublisher.setOpacity(1)
           $(this).text('Hide points layer')
           .addClass('hide_it')
         } 

    break;

    case 'hide_points_search':

      var canvas_exists,my_canvas;
     $.each(map._layers, function(index, value)  
      {     
        if (typeof(value.type)!=='undefined')
          {       
          if (value.type=='canvas')
          {          
        canvas_exists=true;
        my_canvas=value;
        }
        }
          
      })

      if (canvas_exists!==true)
      {
        alert('Your individual occurrence request layer is not defined!');
        return false
      }
     if ($(this).hasClass('hide_it'))
          {
        

          my_canvas.setOpacity(0)
          
          $(this).text('Show points search')
           .removeClass('hide_it')
        }
        else
        {
          
           my_canvas.setOpacity(1)
           $(this).text('Hide points search')
           .addClass('hide_it')
         } 

    break;
  }

})
$('#config_manager li').click(function (e)
{
var $target=$(e.target)
var $parent=$target.parent();

if (!$target.hasClass('red_tipsy'))
{
 
$parent.find('.red_tipsy').removeClass('red_tipsy')
$target.addClass('red_tipsy');
map.config_event=$target.attr('id');

$.each(map._layers, function(index, value)  
{
  //value.type!=='data_points' && 
if (typeof(value.interaction)!=='undefined')
{

var this_url=value.my_url;
var this_name=value.my_id
value.interaction.off()

if (value.type=='data_points')
{
var points_type=value.points_type;
map.removeLayer(value)

console.warn(points_type)
add_layer(points_type,this_name,'')
}

else
{
  map.removeLayer(value)
create_layer(this_url,this_name,map.config_event)    
}
}
})

}


          
})


layers_list=[];
$('.my_highcart_tooltip').live('mouseover',function (e)
{
  if ($(e.target).is('a'))
  {
   var taxa_node=$(this).find('#taxa_name');
   
   var taxa_name=taxa_node.html();
   var id;


  $.getJSON('http://ecat-dev.gbif.org/ws/usage/?rkey=1&q='+taxa_name+'&searchType=canonical&callback=?',
       { format:'JSONP'},
       function(json, textStatus) 
    {
      console.warn(json.data[0].taxonID)
      var id=json.data[0].taxonID;
             url="http://www.gbif.fr:8080/portal-test/taxas/show?taxonId="+id;
     
      $(e.target).attr('href',url).trigger('click')
      
      
      //optional stuff to do after success
    });

    // $.when(search_ecatID (taxa_name)()).then(function(id)
    //   {
      
       
    //    url="http://www.gbif.fr:8080/portal-test/taxas/show?taxonId="+id;
    //  console.info(url)
    //  })

  }

  
})

// $.when(search_ecatID (this_taxa)()).then(function(id)
//       {
      
      
//        console.info(url)
//        url="http://www.gbif.fr:8080/portal-test/taxas/show?taxonId="+id;
     
//      })

 function search_ecatID (this_taxa)
 {
        return function ()
  {

  }
 }  

$('.icon-exchange').click(function ()
	{

		var $this=$(this)
		var this_name=$this.parent().attr('id');
		

      if ($.inArray(this_name,layers_list)!==-1)
      {

  
      	
      	$this.attr({'data-style':'waypoints_popover','rel':'popover'})

		$(this).popover(
		  {
		  trigger:'manual',
		    html: true,
		    placement: 'bottom',
		   
		    delay: { show: 500, hide: 10000 },

		   title:  'Change layer'+this_name+' opacity <i class="icon-remove" style="color:black;float:right;"></i>',
		   content: 'test'
   

   			})
		//hacking around!
$this.popover('show');
var $cloned_el=$('.dial').clone(true)
$this.data('popover').tip().find('.popover-content').empty().append('<div data-property="font-size" class="dial first">'+$cloned_el.html()+'</div>').height(150);	


$this.data('popover').tip().find('.popover-content li').waypoint(function(e, direction) {

    var $active = $(this);
	console.warn($active)
    if (direction === "up") {
      $active = $active.prev();
    }
    //notify('jsut a test')
   
console.warn($active.data('value'))
     if (!$active.length) $active.end();
//layer_to_change.setOpacity(0)
   // layer_to_change.setOpacity(parseInt($active.data('value')))
      var layer_to_change
    for (var p in map._layers)
    {
      if (map._layers[p].my_id && map._layers[p].my_id==this_name)
      {
        
        layer_to_change=map._layers[p];//map._layers[p]//;.setOpacity(parseInt($active.data('value')))
      }
    }
    layer_to_change.setOpacity($active.data('value'))



	}
	, {
	    offset: 5,
	    context: 'ul'
	  })
	}

})	

    $('#stats_manager li').click(function (event)
        {
          var this_name=this.id;
          if (typeof(my_dataset_id)!=='undefined')
          {
            
            var path='dept_dataset_'+my_dataset_id;
          }
          else
          {
            var path='dept_datapub_'+datapublisher_id;
          }
        switch (this_name)
        {
          case 'stats_departements' : 
          var url='http://www.gbif.fr/mbtiles/stats/departements/'+path+'/metadata.jsonp';
          break;

          case 'stats_regions' : 
          var url='http://www.gbif.fr/mbtiles/stats/regions/'+path+'/metadata.jsonp';
          break;

        }
          
          var this_class=event.target.className;  

    switch (this_class)
      {

      case 'icon-eye-open':

         wax.tilejson(url, function(tilejson) {
         
          var this_layer = new wax.leaf.connector(tilejson);
          
          this_layer.my_id=this_name;

           map.addLayer(this_layer);
this_datapublisher.bringToFront();
             layers_list.push(this_name);
      

           var center=tilejson.center.split(',');
           var legend=tilejson.legend;
          

           if (typeof(legend)!=='undefined')
           {
           $('.legend-tooltip').show()
            $('.legend-tooltip_content').not('.icon-remove').empty().append(legend).show();
           }
          
         var lat=center[1];
        var lng=center[0];
        var zoom=center[2];
        var latlng=new L.LatLng(lat,lng);

        map.setView(latlng, zoom);

           this_layer.interaction=wax.leaf.interaction(this_layer)
       this_layer.interaction.map(map)
        .tilejson(tilejson)     
        .on({
          on: function(o) {
      
              
             if (o.e.type == map.config_event) 
            {
             

           
 // var current_communes=o.data.NOM_COMM; 
 //          if (prev_data!==current_communes)
 //          {
        $('.wax-tooltip').show();

        //apply_template on map_functions
        var content=apply_template(this_name,o.data)
       $('#wax-tooltip_content').not('.icon-remove').empty().append(content).show();

        }
        }
      })
      //this_layer.interaction.on();


        
         
           })
  
         $(event.target).replaceWith("<i class='icon-eye-close'></i>");
         console.warn(this_datapublisher)
            

    break;
    case 'icon-eye-close':

     $.each(map._layers, function(index, value)  
      {
      if (value.my_id==this_name)
      {
        map.removeLayer(value)
        //layers_list.splice
      }
      })
     $(event.target).replaceWith("<i class='icon-eye-open'></i>")

    break;

      case '':

     $.each(map._layers, function(index, value)  
      {
      if (value.my_id==this_name)
      {
        //map.removeLayer(value)
      }
      })
      
     

    break;

  }

        })

	// Stuff to do as soon as the DOM is ready;
  var config_event='mousemove';
	$('#french_layers_manager li,#international_layers_manager li').click(function (event)
{
 
  
  var this_name=this.id;

  var this_class=event.target.className;
  switch (this_class)
  {

  		case 'icon-eye-open':

  		  var url='http://www.gbif.fr/mbtiles/layers/'+this_name+'/metadata.jsonp';
console.info('swithcing to '+map.config_event)
       create_layer(url,this_name,map.config_event)


         
         $(event.target).replaceWith("<i class='icon-eye-close'></i>")

  	break;
		case 'icon-eye-close':

     $.each(map._layers, function(index, value)  
      {
      if (value.my_id==this_name)
      {
        map.removeLayer(value)
        //layers_list.splice
      }
      })
     $(event.target).replaceWith("<i class='icon-eye-open'></i>")

  	break;

  		case '':

     $.each(map._layers, function(index, value)  
      {
      if (value.my_id==this_name)
      {
        //map.removeLayer(value)
      }
      })
      
     

  	break;

  }
  
 

})

});