import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import chinaMap from './china.json';
import './index.css';
import coverImg from '../../assets/cover.jpg';
// import start1Img from '../../assets/start1.png';
// import start2Img from '../../assets/start2.png';

const provinces = [
    {
        "name": "上海市",
        "lng": 121.438737,
        "lat": 29.972559
    },
    {
        "name": "云南省",
        "lng": 101.485106,
        "lat": 25.008643
    },
    {
        "name": "内蒙古自治区",
        "lng": 114.077429,
        "lat": 42.331087
    },
    {
        "name": "北京市",
        "lng": 116.01995,
        "lat": 38.9
    },
    {
        "name": "吉林省",
        "lng": 126.171208,
        "lat": 42.503954
    },
    {
        "name": "四川省",
        "lng": 102.693453,
        "lat": 30.674545
    },
    {
        "name": "天津市",
        "lng": 117.747043,
        "lat": 37.788036
    },
    {
        "name": "宁夏回族自治区",
        "lng": 106.169866,
        "lat": 36.291332
    },
    {
        "name": "安徽省",
        "lng": 116.826884,
        "lat": 30.849254
    },
    {
        "name": "山东省",
        "lng": 118.187759,
        "lat": 35.376092
    },
    {
        "name": "山西省",
        "lng": 111.904436,
        "lat": 35.818179
    },
    {
        "name": "广东省",
        "lng": 113.429919,
        "lat": 23.734643
    },
    {
        "name": "广西壮族自治区",
        "lng": 108.7944,
        "lat": 23.833381
    },
    {
        "name": "新疆生产建设兵团",
        "lng": 88,
        "lat": 39
    },
    {
        "name": "新疆维吾尔自治区",
        "lng": 88,
        "lat": 42
    },
    {
        "name": "江苏省",
        "lng": 119.486506,
        "lat": 31.983991
    },
    {
        "name": "江西省",
        "lng": 115.732975,
        "lat": 27.636112
    },
    {
        "name": "河北省",
        "lng": 114.902461,
        "lat": 36.545474
    },
    {
        "name": "河南省",
        "lng": 113.619717,
        "lat": 32.902648
    },
    {
        "name": "浙江省",
        "lng": 119.709913,
        "lat": 28.581466
    },
    {
        "name": "海南省",
        "lng": 109.754859,
        "lat": 19.189767
    },
    {
        "name": "湖北省",
        "lng": 112.271301,
        "lat": 30.487527
    },
    {
        "name": "湖南省",
        "lng": 111.711649,
        "lat": 27.629216
    },
    {
        "name": "甘肃省",
        "lng": 104.823557,
        "lat": 34.058039
    },
    {
        "name": "福建省",
        "lng": 118.006468,
        "lat": 26.069925
    },
    {
        "name": "西藏自治区",
        "lng": 88.388277,
        "lat": 31.56375
    },
    {
        "name": "贵州省",
        "lng": 106.880455,
        "lat": 26.326368
    },
    {
        "name": "辽宁省",
        "lng": 122.604994,
        "lat": 40.299712
    },
    {
        "name": "重庆市",
        "lng": 107.8839,
        "lat": 29.067297
    },
    {
        "name": "陕西省",
        "lng": 108.887114,
        "lat": 33.263661
    },
    {
        "name": "青海省",
        "lng": 96.043533,
        "lat": 35.726403
    },
    {
        "name": "黑龙江省",
        "lng": 127.693027,
        "lat": 46.040465
    },
    {
        "name": "台湾省",
        "lng": 120.5,
        "lat": 24.2
    },
    {
        "name": "澳门特别行政区",
        "lng": 113.4,
        "lat": 22.3
    },
    {
        "name": "香港特别行政区",
        "lng": 114.4,
        "lat": 22.5
    }
]

const labelOnlyRegions = new Set(['台湾省', '澳门特别行政区', '香港特别行政区']);

// 特殊地区的标签偏移配置
const labelOffsetConfig = {
  '澳门特别行政区': { lng: 0, lat: -1 }, // 向左下偏移
  '香港特别行政区': { lng: 2, lat: 0 },  // 向右下偏移
};

export const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export const geoLayout = {
  left: 250,
  top: 50,
  // 可选：使用 layoutCenter / layoutSize 进行精确居中与缩放
  // 例如：layoutCenter: ['50%', '50%'], layoutSize: '100%'
  layoutCenter: null,
  layoutSize: null,
  // 可选：固定宽高（不建议与 layoutCenter 同时使用）
  width: 1400,
  height: 1400,
  // 可选：以经纬度设置地图中心与缩放
  center: null,
  zoom: 1,
};

export const mapProjectionType = 'mercator';

function Home({ onStart1Click, onStart2Click, onMarkerClick }) {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart;
    let disposed = false;
    chart = echarts.init(chartRef.current);
    echarts.registerMap('china', chinaMap);
    const data = [];
    const labelOnlyData = [];
    const linesData = []; // 用于存储引导线数据

    provinces.forEach((p) => {
      const lat = p.lat > 31.072559 ? +(p.lat - 0.1).toFixed(6) : p.lat;
      const originalPoint = { name: p.name, value: [p.lng, lat, 1] };

      if (labelOnlyRegions.has(p.name)) {
        if (labelOffsetConfig[p.name]) {
          // 如果有偏移配置，创建引导线
          const offset = labelOffsetConfig[p.name];
          const offsetLng = p.lng + offset.lng;
          const offsetLat = lat + offset.lat;
          
          // 添加引导线
          linesData.push({
            coords: [
              [p.lng, lat],       // 起点：实际位置
              [offsetLng, offsetLat] // 终点：标签位置
            ]
          });
          
          // 添加标签点到偏移位置，并根据地区设置不同的标签位置
          const labelConfig = {
            '香港特别行政区': 'right',  // 香港标签在引导线右方
            '澳门特别行政区': 'bottom'  // 澳门标签在引导线下方
          };
          labelOnlyData.push({ 
            name: p.name, 
            value: [offsetLng, offsetLat, 1],
            label: { position: labelConfig[p.name] || 'bottom' }
          });
        } else {
          // 没有偏移配置的直接添加
          labelOnlyData.push(originalPoint);
        }
        return;
      }
      data.push(originalPoint);
    });
    const projection = mapProjectionType === 'mercator'
      ? null
      : {
          project: function (pt) {
            return [pt[0], pt[1]];
          },
          unproject: function (pt) {
            return [pt[0], pt[1]];
          },
        };
    chart.setOption({
      tooltip: { show: false },
      geo: {
        map: 'china',
        roam: false,
        silent: true,
        ...geoLayout,
        projection,
        itemStyle: {
          areaColor: 'rgba(0,0,0,0)',
          borderColor: 'rgba(0,0,0,0)',
          borderWidth: 0,
        },
        emphasis: {
          itemStyle: {
            areaColor: 'rgba(0,0,0,0)',
          },
        },
      },
      series: [
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          symbolSize: 30,
          label: {
            show: true,
            formatter: '{b}',
            position: 'bottom',
            color: 'rgb(0,0,0)',
            opacity: 0.7,
            fontSize: 20,
            padding: 0,
            fontFamily: 'FZLanTingHeiS-DB-GB',
          },
          emphasis: {
            label: { show: true },
          },
          itemStyle: { color: '#f89710ff' },
          data,
          encode: { tooltip: 2 },
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: 1,
          silent: true,
          label: {
            show: true,
            formatter: '{b}',
            position: 'bottom',
            color: 'rgb(0,0,0)',
            opacity: 0.7,
            fontSize: 20,
            padding: 0,
            fontFamily: 'FZLanTingHeiS-DB-GB',
          },
          itemStyle: {
            color: 'rgba(0,0,0,0)',
          },
          emphasis: {
            label: { show: true },
            itemStyle: {
              color: 'rgba(0,0,0,0)',
            },
          },
          data: labelOnlyData,
          encode: { tooltip: 2 },
        },
        {
          type: 'lines',
          coordinateSystem: 'geo',
          symbol: ['none', 'none'],
          lineStyle: {
            color: 'rgb(0,0,0)',
            opacity: 0.7,
            width: 1,
            type: 'solid',
          },
          data: linesData,
        },
      ],
    });
    chart.on('click', function (params) {
      if (params.seriesType === 'effectScatter') {
        const nativeEv = params?.event?.event || params?.event;
        if (nativeEv) {
          nativeEv.stopPropagation && nativeEv.stopPropagation();
          nativeEv.preventDefault && nativeEv.preventDefault();
          nativeEv.cancelBubble = true;
        }
        if (onMarkerClick) {
          onMarkerClick(params.name);
        }
      }
    });
    const onResize = () => chart && chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      chart && chart.dispose();
    };
  }, []);
  const handleStart1Click = (e) => {
    e.stopPropagation();
    if (onStart1Click) {
      onStart1Click();
    }
  };

  const handleStart2Click = (e) => {
    e.stopPropagation();
    if (onStart2Click) {
      onStart2Click();
    }
  };

  return (
    <div
      className="home-page"
      style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div
        ref={chartRef}
        style={mapContainerStyle}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      />
      {/* <div className="learn-more-btn" onClick={handleStart1Click}>
        <img src={start1Img} alt="了解更多" />
      </div>
      <div className="learn-more-btn" onClick={handleStart2Click} style={{ top: '720px' }}>
        <img src={start2Img} alt="了解更多" />
      </div> */}
    </div>
  );
}

export default Home;
