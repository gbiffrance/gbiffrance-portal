/*
//EXPERIMENTAL for allowing point interrogation in main interface
$('.hoverbox').live('click',function(event)
           {
          
          big_array=[];
           target=event.target     
 
           target_id=target.id;

           var my_id=$(this).find('#point_centroid').attr('class');          
        
           switch(target_id)
           {

           case 'more_info':
 

      var datapublisher_id=$(this).data(datapublisher_id);
      var dataset_id=$(this).data(dataset_id);

       jQuery.ajax({url:'http://lully.snv.jussieu.fr/gbif/mapping/php/dataportal/get_counts_point.php',
             data: {point_id:my_id,data_id:datapublisher_id,'data_type':'datapublisher'},
             type: 'GET',
            dataType: 'jsonp',
            success: function(data)
            {
 
            var content='<div id="show_genus_id">Nombre genres <b>'+data.num_genus+'</b>';
            console.info(content)
            $(target).html(content)               
              
                }
              })
    
           case 'show_genus_id': 
           
   
       $(event.target).toggleClass('selected')
      
            var content='';
             jQuery.ajax({url:'http://lully.snv.jussieu.fr/gbif/mapping/php/dataportal/get_taxonomic_arrays_final2.php',
             data: {point_id:my_id,taxa:'genus',datapublisher_id:datapublisher_id,'data_type':'datapublisher'},
             type: 'GET',
            dataType: 'jsonp',
            success: function(data)
            {
                    for (i=0;i<data['data'].length;i++)
                        {
                        var d=data['data'][i].split('+');

                        big_array.push(d)

                        }
                      window.to_plot='genus';
                      console.dir(big_array)

                      orderby('names',big_array,to_plot) 
                      
                      

          }
            })  
           //console.warn('targeting genus'+$my_id);
          return false; 
          break;

            case 'show_phylum_id': 

           

        //   options={url: 'http://localhost:8887/test_maps/get_taxonomic_arrays.php',data: {id:my_id}}
            var content='';
             jQuery.ajax({url:'http://lully.snv.jussieu.fr/gbif/mapping/php/get_taxonomic_arrays_final.php',
              data: {point_id:my_id,taxa:'phylum',data_id:datapublisher_id,'data_type':'datapublisher'},
             type: 'GET',
            dataType: 'jsonp',
            success: function(data)
            {
//  console.warn(data)
window.to_plot='phylum'
       for (i=0;i<data['data'].length;i++)
                        {
                        var d=data['data'][i].split('+');
                 
                        big_array.push(d)
                 
                        }
                 

                      orderby('names',big_array,to_plot) 
           

          }
            })
           //console.warn('targeting genus'+$my_id);
          return false; 
          break;
   case 'show_order_id': 

           

        //   options={url: 'http://localhost:8887/test_maps/get_taxonomic_arrays.php',data: {id:my_id}}
            var content='';
             jQuery.ajax({url:'http://lully.snv.jussieu.fr/gbif/mapping/php/get_taxonomic_arrays_final.php',
              data: {point_id:my_id,taxa:'orderr',data_id:datapublisher_id,'data_type':'datapublisher'},
             type: 'GET',
            dataType: 'jsonp',
            success: function(data)
            {
        for (i=0;i<data['data'].length;i++)
                        {
                        var d=data['data'][i].split('+');

                        big_array.push(d)

                        }
                      window.to_plot='order';
                      orderby('names',big_array,to_plot) 

          }
            })
           //console.warn('targeting genus'+$my_id);
          return false; 
          break;
          case 'show_class_id': 
            var content='';
             jQuery.ajax({url:'http://lully.snv.jussieu.fr/gbif/mapping/php/get_taxonomic_arrays_final.php',
              data: {point_id:my_id,taxa:'classs',data_id:datapublisher_id,'data_type':'datapublisher'},
             type: 'GET',
            dataType: 'jsonp',
            success: function(data)
            {

window.to_plot='classs'
             for (i=0;i<data['data'].length;i++)
                        {
                        var d=data['data'][i].split('+');

                        big_array.push(d)

                        }

                      orderby('names',big_array,to_plot) 
    
           

          }
            })
           //console.warn('targeting genus'+$my_id);
          return false; 
          break;
          
          case 'show_scientificname_id':
          

            var content='';
                        jQuery.ajax({url:'http://lully.snv.jussieu.fr/gbif/mapping/php/dataportal/get_taxonomic_arrays_final.php',
               data: {point_id:my_id,taxa:'scientificname',data_id:datapublisher_id,'data_type':'datapublisher'},
                        type: 'GET',
                        dataType: 'jsonp',
                        success: function(data)
                        {
            
                        for (i=0;i<data['data'].length;i++)
                        {
                        var d=data['data'][i].split('+');
                        big_array.push(d)
                        }
                      window.to_plot='scientificname';
                      orderby('names',big_array,to_plot) 

               
                      }
                        })
            
          break;
            
            
            
           default: //alert('nooops'); 
           break;
           }
//           $.get..

       
           })

*/
function add_layer(data_type,id,title)
  {
  if (data_type=='dataset')
  {
var url='http://www.gbif.fr/mbtiles/datasets/'+id+'/metadata.jsonp'; 
  }
  else
  {
   var url='http://www.gbif.fr/mbtiles/datapublishers/'+id+'/metadata.jsonp';  
  }
  
  wax.tilejson(url, function(tilejson) {
  
          this_layer = new wax.leaf.connector(tilejson);
          this_layer.my_id=id;
          this_layer.url=url;
          this_layer.type='data_points';
          this_layer.points_type=data_type;

           map.addLayer(this_layer,false);
             this_layer.bringToFront()

              this_layer.setOpacity(1)

         var center=tilejson.center.split(',')
         var lat=center[1];
        var lng=center[0];
        var zoom=parseInt(center[2])+1;
        var latlng=new L.LatLng(lat,lng);
      //   map.setView(latlng, zoom);

         this_layer.interaction= wax.leaf.interaction(this_layer)
    .map(map)
    .tilejson(tilejson)     
    .on({
      on: function(o) {
 // console.warn(map.mouseEventToLatLng(o.e))
 // console.info(o.data)

// console.dir(o.e)

         if (o.e.type == map.config_event) 
        {
var relativeX = o.e.pageX - $map.offsetLeft-10; 
var relativeY = o.e.pageY - $map.offsetTop-10;
 var obj=o.data;


// var dataset_info,dataset_name; 

var latlng=map.mouseEventToLatLng(o.e)
 var this_y=map.latLngToLayerPoint(latlng).y
var this_x=map.latLngToLayerPoint(latlng).x
var num_occ=obj.count_occurrences;

var log=Math.log(num_occ)*3;

mouseover_circle.transition()
//
  .attr("cx",this_x).attr("cy",this_y).duration(250).attr('opacity',1).attr("r",10).duration(150) 
var this_data;

var point_id=obj.point_id;
var count_occurrences=obj.count_occurrences;
var content='';
//.data({datapub_id:obj.datapublisher_id, dataset_id:obj.dataset_id}).get(0);//.html();
//[0].text()

//console.warn(content[0])
content+='<div class="hoverbox" style="z-index:10000"><div id="point_centroid" class="'+obj.point_id+'"/></br><b>'+obj.count_occurrences+'</b> occurrences</br>'; 

//dealing with main interface, still not ready for point interrogation
if (title=='')
{
content+='<div id="more_info">Get more info</div></div>';
}


 $('circle.mouseover_circle').attr('title', content).show();
console.dir(obj)
 $('.hoverbox').data({'datapublisher_id':obj.datapublisher_id, 'dataset_id':obj.dataset_id});        
     }

      }
     })
        // $('#occ_manager').append('<li><label><b>'+title+'</b><span action="remove_occ">   Remove   </span> <span action="hide_occ">   Hide   </span> <span action="highlight_occ">   Highlight   </span></label></li>').css('display','visible')

      //  $('#menu_manager a').trigger('click')
      if (title!=='')
      {
       // $('#occ_manager').append('<li><label><b>'+title+'</b><span action="remove_occ">   Remove   </span> <span action="hide_occ">   Hide   </span> <span action="highlight_occ">   Highlight   </span></label></li>').css('display','visible')

         $('#menu_manager').show();
         var $li=$('<li><label><b>'+title+'</b><span action="remove_dt">   Remove   </span> <span action="hide_dt">   Hide   </span> </label></li>').data('_id',id)
         //<span action="highlight_dt">   Highlight   </span>
         $li.appendTo($('#dt_manager'))
         $li.find('span[action="hide_dt"]').data('show',true)
      }


           })
  }

 function create_layer (url,this_name,config_event)
        {
          console.info('creating layer '+url)
         wax.tilejson(url, function(tilejson) {

          var this_layer = new wax.leaf.connector(tilejson);
          
          this_layer.my_id=this_name;
          this_layer.my_url=url;

           map.addLayer(this_layer);

                      layers_list.push(this_name);
console.warn(layers_list)

           console.info(this_layer.my_url)

                  //layers_list.push(this_name);

       this_layer.interaction=wax.leaf.interaction(this_layer)
       this_layer.interaction.map(map)
        .tilejson(tilejson)     
        .on({
          on: function(o) {
      
   // console.warn(config_event)
   // console.log(o.e.type)
             if (o.e.type==config_event) 
            {
                    $('.wax-tooltip').show();

        //apply_template on map_functions
        var content=apply_template(this_name,o.data)
     //   console.info(content)
        $('#wax-tooltip_content').not('.icon-remove').empty().append(content).show();
            }
        }
      })
      this_layer.interaction.on();

      if (typeof(this_datapublisher)!=='undefined')
      {
             this_datapublisher.bringToFront()
      }
        
         
           }) 
        }

//this function should be more generalistic (improve TileMill tooltips)
function apply_template(layer,data)
        {
          var content='<div class="page-header">';

          switch (layer)
          {

            case 'stats_departements':
      
            content+='<h1><span class="red_tipsy">'+data.dept_name+'</span></h1>';
            content+='<h2>Région '+data.region_name+'</h2>';
            content+='<h2>Number occurrences '+data.count_occurrences+'</h2></div>';
            content+='<h2>Number species '+data.count_scientificname+'</h2></div>';
            break;

            case 'communes_france':
            var current_communes=data.NOM_COMM; 
           var dept=data.NOM_DEPT; 
           var region=data.NOM_REGION;  
           var population=data.POPULATION;
           
            
            content+='<h1><span class="red_tipsy">'+current_communes+'</span></h1>';
            content+='<h2>Département '+dept+'</h2>';
            content+='<h2>Région '+region+'</h2></div>';
            break;

            case 'wpda_france':
             var park_name=data.N6; 
             var type=data.N8; 

            content+='<h1><span class="red_tipsy">'+park_name+'</span></h1>';
            content+='<h2>Status: '+type+'</h2>';
       
            break;

                case 'wpda_africa':
             var park_name=data.orig_name; 
             var type=data.design_eng; 
             var iucn_cat=data.iucn_cat;             
            
            content+='<h1><span class="red_tipsy">'+park_name+'</span></h1>';
            content+='<h2>Type: '+type+'</h2>';
            content+='<h2>IUCN category: '+iucn_cat+'</h3>';
       
            break;


            default: break;
          }

            return content
          
        }

function recalculate_position (map_left,w,h)
{

$('#map').css({left:-map_left})
$('#map').css({height:h,width:w})

var map_w=$('#map').width();
var map_h=$('#map').height();
$('#map_ajax_image').css({left:map_w/2,top:map_h/2})
}

var data;
var datapublishers_json;

var paths={};
var bboxes=[]

var dataset_bboxes=false
var o_colors=['lime','orange','orangered','royalblue','blue','gold','lightseagreen','greenyellow','turquoise','darkcyan','blueviolet','cornflowerblue',]
var ramp_colors=new Array();
var colors=[]
var polygon;
var taxa,datapublisher;
for (i=0;i<o_colors.length-1;i++)
{
var new_colors=$.xcolor.analogous(o_colors[i],6,20);

colors[i]=new Array();
for (d in new_colors)
{
var this_color_obj=new_colors[d]
var this_color='rgb('+this_color_obj.r+','+this_color_obj.g+','+this_color_obj.b+')'
colors[i].push(this_color)
}

ramp_colors.push(colors[i])
}

var path = d3.geo.path().projection(function project(x) {
    var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));

    return [point.x, point.y];
  });

    function reset() {
    //polygon flags that some rectangle exists and have to reproject at each zoom in/out
    if (polygon==true)
    {
   var current_zoom=map.getZoom()
 // zoom_level='five_degrees';   STILL NECESSARY?  
      for (zoom_level in paths)
      {
    paths[zoom_level].forEach(function (d)
          {        
            d.attr("d",path)      
          })
      }      
    }
    } 


paths_taxa={};

function generate_paths (features,zoom_level)
   {

   if (typeof paths_taxa[zoom_level]=='undefined') paths_taxa[zoom_level]=[]
 
  bounds = d3.geo.bounds(features)
  var opacityScale = d3.scale.linear()
                     .domain([d3.min(features, function(d) { return d.properties.count; }), d3.max(features, function(d) { return d.properties.count; })])
                     .range([0.4, 1]);  
  var count_extent = d3.extent(features, function(d){return d.properties.count});

  var ramp =d3.scale.linear().domain(count_extent).range(ramp_colors[num_plotted_taxa]);
  var this_path='path.'+zoom_level
  
   var  path_feature = g.selectAll(this_path).attr('centroid',function (d) {return d.centroid})
    .data(features,function (d)
    {
      var centroid=d.centroid;

  //   if (typeof paths_taxa[zoom_level][centroid]=='undefined') paths_taxa[zoom_level][centroid]=[]    
  //   if ($.inArray(taxa,paths_taxa[zoom_level][centroid])==-1)   
  //   {
  // //  console.log('adding taxa '+taxa+' to centroi '+centroid)
  //   paths_taxa[zoom_level][centroid].push(taxa);     
  //   } 
   return d.centroid;
    })
  path_feature.enter().append("path").attr("d", path).attr('class',zoom_level).attr('opacity',0.8).attr('random_id',function (d)
  {
    return parseInt(d.random_id);
  })

  /*
  attr('fill',function (d){ 
  d.fill_color=ramp(d.properties.count);
//console.warn(ramp(d.properties.count))
  return ramp(d.properties.count)}).attr('opacity',1)
                       // .attr('opacity',function (d) { d.fill_opacity=opacityScale(d.properties.count);
                          //return opacityScale(d.properties.count)})
                          */

//  console.info(path_feature)
  path_feature.each(function (d)
   {
    var centroid=d.centroid
    
    if (typeof $(this).data('centr')=='undefined')
    {
      $(this).data('centr',[])
      $(this).data('info_taxes_colors',[])
      $(this).data('info_taxes',[])
      $(this).data('info_ids',[])
      $(this).data('info_counts',[])
      $(this).data('centr').push(centroid);
      $(this).data('total_counts',0)
      $(this).data('visualized_items',0)
    }
    
    

        if ($.inArray(taxa,$(this).data('info_taxes'))==-1)   
    {
  //  console.log('adding taxa '+taxa+' to centroi '+centroid)
      $(this).data('info_taxes').push(taxa);   
      $(this).data('info_ids').push(d.properties.random_id)
      $(this).data('info_counts').push(d.properties.count)  
      $(this).data('info_taxes_colors').push(ramp(d.properties.count)) 
      var total=$(this).data('total_counts')+d.properties.count 
      $(this).data('total_counts',total)
      var visualized_items=$(this).data('visualized_items')
      $(this).data('visualized_items',visualized_items+1)

      var info_taxes_colors=$(this).data('info_taxes_colors')      
  
      if (info_taxes_colors.length>1)
      {
        var new_color=$.xcolor.additive($(this).attr('fill'),ramp(d.properties.count))
        $(this).attr('fill',new_color)
        d.fill_color=new_color
        //    console.warn(d)
    }
    else
    {
    $(this).attr('fill',info_taxes_colors[0])
    
    
    }

    } 


    var _this=d3.select(this);
    //var this_fill=_this.attr('fill')
    var this_opacity=_this.attr('opacity')

    // _this.transition().duration(500).attr('opacity',this_opacity+0.2).attr('fill','yellow').each("end", function () { _this.transition().duration(1500).attr('opacity',this_opacity).attr('fill',this_fill) });
    
    polygon=true;
    })
  


if (typeof paths[zoom_level]=='undefined') paths[zoom_level]=[]

//if (typeof paths[zoom_level][taxa]=='undefined') paths[zoom_level][taxa]=[]
    paths[zoom_level].push(path_feature); 


              
window.bounds=bounds;
polygon=true;

window['$path_'+zoom_level]=$('path.'+zoom_level)
//console.log('$path_'+zoom_level)
   // $path_1=$('path.one_degree')
   // $path_0_5=$('path.half_degree')
   // $path_3=$('path.three_degree')

var $to_tipsy=window['$path_'+zoom_level].filter(function (i,val)
{
return $(val).attr('opacity')>0
})

$to_tipsy.tipsy({ 
                              delayIn: 500, 
                              fade: true, 
                              gravity: 'w', 
                               offset: 0, 
                               opacity:1,
                              html: true, 
                              title: function() {

                              if ($(this).attr('opacity')>0)
                              {

                                var d = this.__data__;
                                var info_taxes=$(this).data('info_taxes');
                                var info_counts=$(this).data('info_counts');
                                var text='<b>Total occurrences</b> <b>'+$(this).data('total_counts')+'</b> for '+info_taxes.length+' taxonomies<p>';                              
                                for (i=0;i<info_taxes.length;i++)
                                {
                                 text+='<span class="red_tipsy">'+info_taxes[i]+'</span> '+info_counts[i]+'<p>';                                 
                                }

                                return text;
               }
               else
               {
               return false;
               }
                              }
                            }) 



   }
var num_plotted_taxa=0; 
 function show_by_polygon2 (data_type)
{
 $.when(query_bounds(data_type))
  .then(function(data){

    $("#ajax_image")
    .ajaxStart(function(){
      //console.warn($(this))
      $(this).show();
    })
    .ajaxComplete(function(){
      $(this).hide();
    });

if (data_type=='datapublisher')
{
var options={'taxa':taxa,'type':window.to_plot,'data_id':datapublisher_id,'req_type':'polygon','zoom':zoom,'data_type':'datapublisher','degree':window.pol_degree};
}
else
{
var options={'dataset_id': my_dataset_id,'taxa':taxa,'type':window.to_plot,'data_id':datapublisher_id,'req_type':'polygon','zoom':zoom,'data_type':'dataset','degree':window.pol_degree};
}
$.ajax({
  url: 'http://lully.snv.jussieu.fr/gbif/mapping/php/dataportal/geojson_cluster_simple_final.php',
  data: options,
  type: 'GET',
  dataType: 'jsonp',


  success: function(data, textStatus, xhr) {

 if (window.pol_degree==4)  zoom_level='four_degrees'; 
    if (window.pol_degree==2)  zoom_level='two_degree'; 

  if (window.pol_degree==5)  zoom_level='five_degrees'; 
    if (window.pol_degree==1)  zoom_level='one_degree'; 
      if (window.pol_degree=='0_5')  zoom_level='half_degree'; 
   
var message='<b>'+addSeparator(data.total)+'</b> occurrences of taxa <b>'+taxa+'</b> distributed in <b>'+addSeparator(data.num_clusters)+'</b> polygons<br><b>Minimum</b> '+addSeparator(data.min)+'   <b>Maximum</b> '+addSeparator(data.max);

if ($('.notify').size()>0) $('.notify').remove()

$('#map_tooltip').before("<div class='notify'>"+message+"</div>")
  
        
     features=data.features;

$layers_manager=$('#layers_manager ul')

$layers_manager.append("<li><label id='"+data.random_id+"'><span style='width:50px;height:50px;color:"+ramp_colors[num_plotted_taxa][0]+"' >▉</span>  <b> "+taxa+'  </b><span action="remove_occ">   Remove   </span> <span action="hide_occ">   Hide   </span> </label></li>');
//<span action="highlight_occ">   Highlight   </span>


if (!$layers_manager.is(':visible')) $layers_manager.show();

   generate_paths(features, zoom_level)
   
   g.selectAll('.'+zoom_level).each(function ()
{
    
    var _this=d3.select(this);
    var this_fill=_this.attr('fill')
    var this_opacity=_this.attr('opacity')
    
   _this.transition().duration(500).attr('opacity',this_opacity+0.2).attr('fill','gold').each("end", function () { _this.transition().duration(1500).attr('opacity',this_opacity).attr('fill',this_fill) });
})





}

});

num_plotted_taxa++;
//console.info('num plotted '+num_plotted_taxa)
});
}

function compareCount(a, b)
 {
 var my_a=parseInt(a[1]);
 var my_b=parseInt(b[1]);           
   if (my_a > my_b) return -1;
   if (my_a < my_b) return 1;
   return 0;
 }
 
 function compareName(a, b)
 {
    if (a[0] < b[0]) return -1;
   if (a[0] > b[0]) return 1;
   return 0;
 }

function query_bounds(data_type)
{

var options={'taxa':taxa,'type':to_plot,'data_type':data_type,'data_id':datapublisher_id};
if (data_type=='dataset') {
  $.extend(true, options, {dataset_id:my_dataset_id});
  
}

var url='http://lully.snv.jussieu.fr/gbif/mapping/php/dataportal/get_extents_by_taxa_final.php';
//   http://lully.snv.jussieu.fr/gbif/mapping/php/geojson_cluster.php
 return jQuery.ajax({url:url,data:options,
 dataType: 'jsonp',
 success: function(data)
 {
 
if (data.main_bbox[0].length= 0) 
  {
   alert('some error in bbox??')
   zoom=2;
    map.fitWorld()
  }
  else
  {
  if (typeof data.main_bbox[1]=='undefined') alert('We cannot get any geo-referenced record for this taxa')
    else
    {
    

    var up_right=data.main_bbox[1].split(',')
    var bottom_left=data.main_bbox[0].split(',')
    //case only one occurrence...
    if (up_right[0]==bottom_left[0])
    {
      
      map.setZoom(6)
    }
    else
    {
    bounds = new L.LatLngBounds(
        new L.LatLng(bottom_left[1],bottom_left[0]),

        new L.LatLng(up_right[1],up_right[0]));  

zoom=map.getBoundsZoom(bounds)

    map.fitBounds(bounds) 
    }
    

    
    }
  }
 }
})
}  //end query_bounds function