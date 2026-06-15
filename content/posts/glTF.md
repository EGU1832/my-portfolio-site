#### glTF  
> 3장면과 모델을 표현하는 file format으로 JSON 표준에 기반한다.  
> Audio의 MP3, Video의 H.264, Images의 JPEG, 3D의 glTF라고 생각하면 된다.  

<br>

##### glTF 2.0 Scene Description Stucture  
<img src="https://www.khronos.org/assets/uploads/apis/2020-core-gltf-2-0-asset-structure.jpg" width="600">
  
- `.gltf(JSON)`:   
- Node 구조  
- PBR meterial texture:  
- PBR(Physically-Based Rendering)이란 그래픽스에서 사용되는 최신 렌더링 기술 중 하나로, 현실 세계의 광학적 특성을 가능한 한 정확하게 묘사하려는 목적을 가지고 있다.  
- Mandatory Metalic-Roughness Materials: 금속성과 거칠기 매개변수를 사용하여 재질을 정의한다. `Base Color(Albedo)`, `Metalness`, `Roughness`, `Emission`, `Normal Map`, `Baked Ambient Occlusion`  
- Optional Specular-Glossiness Materials: 스펙큘러와 윤광 매개변수를 사용하여 재질을 정의한다. glTF에서는 선택적으로 지원된다. `Diffuse`, `Specular`, `Glossiness`  
- Cameras  
- `.bin`:  
- Geometry:  
- vertex(꼭짓점) 배열 정보와 Polygon내의 꼭짓점의 배치를 나타내기 위한 index 배열 정보  
- Animation: 키 프레임들  
- Inverse-bind metrices:  
- glTF는 3D 모델의 애니메이션을 표현하기 위해 skinning 기법을 사용하는데, 이 기법은 mesh(모델의 표면)의 각 vertex가 bone 또는 joint에 연결되어있는 것을 표현하고, 각각의 vertex가 어떤 bone에 의해 변형되는지를 정의한다.  
- Inverse-bind metrices는 각각의 bone에 대해 정의된 변환 행렬들의 역행렬이다. LC에서 MC로 갈 때 모델의 각 vertex에 대해 적용되는 계산을 할 때 역행렬이 필요하다.  
- `.png, .jpg, .ktx2`: 텍스쳐 데이터들  
##### glTF Ecosystem  
<img src="https://www.khronos.org/assets/uploads/apis/2019-gltf-ecosystem_1_21.jpg" width="600">
  

<br>

##### Industry Support for glTF  
<img src="https://www.khronos.org/assets/uploads/apis/2017-gltf-20-launch-3_26.jpg" width="600">
  

<br>

##### Software  
- glTF Loader  
- OpenSource glTF: [glTF – Runtime 3D Asset Delivery (github.com)](https://github.com/KhronosGroup/glTF#converters)  
- glTF File: 다양한 3D 편집 도구를 사용해 내보내기를 할 수 있다. `Blender`, `3ds Max`, `Maya`  
- glTF Utility Libraries: 다양한 언어에서 glTF를 활용할 수 있다. `C++`, `C#`, `Java`, `Lust`, `Go`  
- glTF Walidator: 만들어진 파일이 glTF 표준에 적합한지를 테스트 할 수 있다.  

<br>


<br>

`plus alpha: JSON`  
- JSON(JavaScript Object Notation):  
- 속성-값 쌍, 배열 자료형 또는 기타 모든 시리얼화 가능한 값 또는 키-값 쌍으로 이루어진 data object를 전달하기 위해 인간이 읽을 수 있는 텍스트를 사용하는 개방형 표준 format이다.  

<br>

# glTF Overview  

<br>

#### Reference  
<img src="Docs/gltfOverview-2.0.0d.png">
  
- [glTF – Runtime 3D Asset Delivery (github.com)](https://github.com/KhronosGroup/glTF)  
- [glTF Viewer](https://gltf-viewer.donmccurdy.com/)  
- [glTF Project Explorer (khronos.org)](https://github.khronos.org/glTF-Project-Explorer/)  

<br>

## 1.1 Top-Level Elements  

<br>

glTF의 코어는 **JSON 파일**의 형태로 3D 모델들을 포함하고 있는 Scene의 구조와 구성에 대해 설명한다.    
여기서 JSON 파일이란, 일련의 데이터를 저장하고 교환하기 위한 경량의 데이터 형식이다. 텍스트 기반으로, 데이터를 Tree 구조로 구성하며 각 데이터는 Name-Key 쌍으로 표현된다.    
다음은 이러한 glTF 파일을 이루고 있는 **Top-Level 요소**들이다.  

<br>

1. **Scenes, Nodes**: Scene의 기본 구조  
2. **Cameras**: Scene의 보기 구성  
3. **Meshes**: 3D Object의 도형  
4. **Buffers, BufferView, Accessors**: 데이터 참조 및 데이터 레이아웃 설명  
5. **Materials**: Object가 어떻게 렌더링되어야하는지에 대한 정의  
6. **Textures, Images, Samplers**: Object의 표면, 겉모습  
7. **Skins**: Vertex Skinning에 대한 정보  
8. **Animations**: 시간에 따른 구성 요소의 변화  

<br>

이 요소들은 배열로 저장되어있다. Object간의 참조는 해당 인덱스를 사용하여 배열의 개체를 검색함으로써 설정한다. 쉽게 말하면 뭐든지 배열로 접근한다는 것이다.    
3D Scene에 관한 전체 정보를 하나의 glTF 파일에 저장하는 것도 가능하다. 말그대로 통용 가능한 표준이라는 것이다.  

<br>

## 1.2 Concepts  

<br>

다음은 Top-Level 요소간의 관계를 시각화 한것이다. `뭔가 많다.. 복잡하다..`  
<img src="Docs/Pasted image 20240701161627.png" width="350">
  

<br>

#### Binary Data references - URI  
3D 요소를 렌더링하는 데 필요한 외부 파일들은 `buffers`와 `images`에 저장된다.    
`buffers`에는 Geometry나 애니메이션 정보를 저장하고 있는 `.bin` 파일들을,    
`images`에는 Model의 텍스쳐 정보를 저장하고 있는 `.png`, `jpg` 파일들을 저장한다.  
```json
"buffers": [
	{
		"uri": "buffer01.bin"
		"byteLength": 102040,
	}
],
"images": [
	{
		"uri": "image01.png"
	}
]
```

<br>

#### Binary Data references - base64  
위 처럼 파일 데이터를 URI로 참조하는 대신 데이터 자체를 JSON 내에 포함시킬 수도 있다.    
MIME 타입 `data:MIMtype`을 정의하고, base64 `base64,string` 형식으로 직접 정보를 입력해놓는다.  
```json
// Buffer Data:
"data:application/gltf-buffer;base64,AAABAAIAAgA..."

// Image Data:
"data:image/png;base64,iVBORw0K..."
```

<br>

## 1.3 Scenes, Nodes  

<br>

#### Hierarchy  
glTF에서 각각의 **Scene**은 **Node**의 인덱스 배열을 포함하고,    
각각의 **Node**는 그 **Chidren**의 인덱스 배열을 포함한다.  
<img src="Docs/Pasted image 20240701172826.png" width="200">
  
<img src="Docs/Pasted image 20240701172858.png" width="200">
  

<br>

#### Node Component  
Node에는 Local Transform 즉, MC에서 WC로 가기위한 $`M_M`$에 관한 정보가 저장되어있다.    
- 이는 배열 표기와 일치하도록 **Column-Major Matrix**, $`M_M`$그 자체로 저장되어 있거나,    
- **Translation, Rotation, Scale**로 분리되어 저장되어 있다.    
Matrix와 T R S 간의 관계식은 다음과 같다.  
<br>


```math
M_M = T \times R \times S
```

T, R, S 정보는 animation의 타겟이 되기도 한다. 시간이 지날 때마다 어떤 Transformation을 참조할지 변화를 주는것이다. 이를 통해 Object나 Camera를 움직인다.  
```json
"nodes": [
	{
		"matrix": [
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		5,6,7,1
		],
		...
	}, 
	{
		"translation":
			[0,0,0],
		"rotation":
			[0,0,0,1],
		"scale":
			[1,1,1]
		...
	},
]
```

<br>

각각의 Node는 이에 더해 **Mesh** 또는 **Camera**를 참조할 수 있다.    
이 정보들은 위의 Transformation 정보와 더해져 렌더링 된다.  
```json
"nodes:" [
	{
		"mesh": 4,
		...
	},
	{
		"camera": 2,
		...
	},
]
```

<br>

Node들은 Vertex Skinning에 쓰이기도 하는데, 움직이는 모델의 Skeleton을 hierarchy적으로 정의할 수 있다.    
여기서 Node는 **Mesh**를 참조하고 그 다음 **Skin**을 참조한다.    
**Skin**에는 현제 Skeleton Pose를 기반으로 Mesh가 어떻게 변형되는지에 대한 추가 정보가 포함되어있다.  

<br>

## 1.4 Cameras  

<br>

위에서 설명했듯이, 각각의 Node는 Camera를 배열의 인덱스를 이용하여 참조한다.    
**Camera**의 구성요소는 Type에 따라 상이해지는데, 그 분류는 다음과 같다.  
- **Perspective**: 원근 투영  
- **Orthographic**: 평행 투영의 일종  
```json
"cameras": [
	{
		"type": "perspective",
		"perspective": {
			"aspectRatio": 1.5, 
			"yfov": 0.65,
			"zfar": 100,
			"znear": 0.01
		}
	},
	{
		"type": "orthographic",
		"orthographic": {
			"xmag": 1.0,
			"ymag": 1.0,
			"zfar": 100,
			"znear": 0.01
		}
	}
]
```
`zfar`의 설정값은 입력해도 되고, 안 해도 된다. 입력하지 않을시, Camera는 Infinite Projection을 위해 특수한 Matrix를 쓰게된다.  

<br>

Type Perspective의 각 요소에 관한 내용은 다음을 상기하자.  
#### Setup for Viewing Volume  
> `glm::mat4 perspective(float fovy, float aspect, float zNear, float zFar);`  
<img src="Docs/Pasted image 20240514123644.png" width="400">
  
- `fovy`: 위 아래 각도  
- `aspect`: $`w/h`$ 가로 세로 비율  
- `zNear`: 앞 절단 평면까지의 거리  
- `zFar`: 뒤 절단 평면까지의 거리  

<br>

Type Orthographic의 각 요소에 관한 내용은 다음을 상기하자.  
#### Setup for Viewing Volume  
> glm::mat4 glm::ortho(float left, float right, float bottom, float top, float zNear, float zFar);  
<img src="Docs/Pasted image 20240514123606.png" width="400">
  
- `left, bottom`: 왼쪽 아래 꼭짓점  
- `right, top`: 오른쪽 위 꼭짓점  
- `zNear, zFar`: 원근 투영 `perspective()`과 같음  

<br>

Node가 Camera를 참조하게 되면, 그 Camera의 인스턴스가 만들어진다.    
Camera의 Matrix, 다른 말로 **Projection Transformation**, 기호로 $`M_P`$에 해당하는 Matrix는 Node의 Global Trasform Matrix에 의해 주어진다.  

<br>

## 1.5 Meshes  

<br>

**Meshes**는 여러 Mesh **Primitives**를 포함한다.    
각각의 Mesh **Primitives**는 다음과 같은 정보들을 포함한다.  
- **Rendering Mode**: `POINT`, `LINES`, `TRIANCLES` 중 어느 모드로 렌더링할지 상수로 표기한다.  
- **Indices**: 해당 data의 Accessor의 인덱스를 통해 참조  
- **Attributes**: 해당 data의 Accessor의 인덱스를 통해 참조하며, 다음과 같이 정보가 저장되어있다.  
<img src="Docs/Pasted image 20240701190936.png" width="400">
  
- **Meterial**: 관련 Meterial의 인덱스  
```json
"meshes": [
 {
  "primitives": [
	{
		"mode": 4,
		"indices": 0,
		"attributes": {
			"POSITION": 1,
			"NORMAL": 2
		},
		"material": 2
	}
  ]
 }
]
```

<br>

#### Deformation - Morph Targets  
Mesh는 또한 **Morph Target**을 여러개 만들어 Mesh의 변형을 묘사할 수 있다.    
여기서 변형이란 다음과 같은 것이다.  
<img src="https://catlikecoding.com/unity/tutorials/mesh-deformation/tutorial-image.jpg" width="200">
  

<br>

- **Targets**: 변형 별 attributes의 여러 버전이라 생각하면 된다.  
- **Weights**: Mesh의 최종 렌더링 상태에 대한 각 Morph Target의 기여도를 정의하는 가중치이다.  
```json
{
 "primitive": [
  {
   ...
	 "targets": [
	 {
	  "POSITION": 11,
	  "NORMAL": 13
	 },
	 {
	  "POSITION": 21,
	  "NORMAL": 23
	 }
    ]
   }
  ],
 "weights": [0, 0.5]
}
```
이렇게 여러개의 Morph Target을 가중치를 다르게 두어 정의함으로써 예를 들자면,    
캐릭터의 얼굴 움직임을 표현할 수 있다. weights와 관련해서, 표정이 변화함에 따라 많이 움직이는 근육이 있고 안 그런 근육이 있음을 상상해보자.  

<br>

## 1.6 Buffers, Bufferviews, Accessors  

<br>

**Buffers**는 3D 모델의 Geometry, 애니메이션, Skinning에 대한 Data를 담고있다.  
**BufferViews**는 위 Data에 구조적인 정보들을 더하고,  
**Accessors**는 Data의 정확한 타입과 레이아웃을 정의한다.    

<br>

Buffers <- BufferViews <- Accessors 이 구조를 상기하자.    
2D vector로 표현된 binary 파일을 참조한다고 생각하며 아래 요소에 대한 설명을 보자.   
Access하는 방법이 처음 볼 땐 꽤나 복잡하니 주의깊게 코드와 그림을 살펴보자.    

<br>

이 section을 이해하기 전, 다음 OpenGL 함수를 알고 가는 것이 좋을 것이다.  
```cpp
glBindBuffer(GL_ARRAY_BUFFER, bufferID);
```
- **glBindBuffer**: 버퍼 객체를 현재 OpenGL 상태 컨텍스트에 바인딩하는 함수  
- 버퍼 객체는 GPU 메모리에 데이터를 저장하는 데 사용된다.  
- 이 함수를 사용하여 OpenGL이 특정한 유형의 버퍼 (array buffer, index buffer 등)에 접근할 수 있도록 설정한다.  

<br>

```cpp
glVertexAttribPointer(attributeIndex, size, type, normalized, stride, pointer);
// attributeIndex: vertex shader에서 해당 vertex 속성의 인덱스
// size: 속성 하나당 요소의 개수
// type: 속성 요소의 데이터 형식
// normalized: 데이터를 정규화할 지 여부
// stride: 다음 속성 데이터까지의 바이트 간격
// pointer: 속성 데이터의 시작 위치
glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, 0);
// 현재 바인딩된 'GL_ARRAY_BUFFER'로부터 vertex 위치 데이터를 가져오고, 이 데이터가 vertex shader의 attribute 인덱서 0에서 사용됨을 정의한다.
```
- **glVertexAttribPointer**: 현재 바인딩된 버퍼에서 vertex 속성 데이터를 가져오는 방법을 OpenGL에 알려주는 함수  
- vertex 속성 데이터는 vertex array에서 vertex의 위치, 색상, 덱스처 좌표 등과 같은 정보를 의미한다.  
- 이 함수를 사용하여 GPU가 버퍼의 데이터를 해석하는 방법을 정의하는 데 사용된다.  

<br>

#### Buffers  
Block 하나당 **URI**를 사용하여 **byteLength** 크기의 Binary data 파일을 지정한다.  
```json
"buffers": [
	{
		"byteLength": 35,
		"uri": "buffer01.bin"
	}
],
```

<br>

#### BufferViews  
BufferViews와 Buffers가 일대일 대응으로 할당된다.    
**byteOffset**과 **byteLength**를 이용하여 BufferView에 속한 Buffer의 부분을 정의한다.    
OpenGL Buffer 관련 **target** 지정은 Optional이다.  
```json
"bufferViews": [
	{
		"buffer": 0,  // 대응되는 buffers의 인덱스 번호
		"byteOffset": 4,
		"byteLength": 28,
		"byteStride": 12,
		"target": 34963
	}
],
```

<br>

#### Accessors  
Accesors는 대응되는 BufferView의 data가 어떻게 해석될지 정의한다.   
추가로 BufferView의 시작을 참조하는 **byteOffset**을 정의할 수 있다.    
나머지 요소는 bufferView data의 Type 및 Layout을 정의한다.  
- **type**: 데이터 유형 `2D vector -> "VEC2"`  
- **componentType**: 데이터 타입 `GL_FLOAT(5126)`  
- **min, max**: 데이터 전체 값의 범위    
```json
"accessors": [
	{
		"bufferView": 0,
		"byteOffset": 4,
		"type": "VEC2",
		"componentType": 5126,  // GL_FLOAT
		"count": 2,  // Accessor가 참조하는 요조의 개수
		"min": [0.1, 0.2],
		"max": [0.9, 0.8]
	}
]
```

<br>

`Plus alpha: min, max`  
- 성능 최적화, 데이터 검증, 압축 및 전송 최적화, 시간적 품질 향상 등 여러가지 이점을 제공한다.  

<br>

#### Sparse Accessors  
Accessor의 몇몇 부분만 디폴트값과 다른 경우(대부분의 경우는 morph target을 지정하는 경우이다.), 우리는 **Sparse**써서 간편하게 코드를 짤 수 있다.  
- **count**: 별개로 다룰 data 요소의 개수  
- **values**: Sparse된 data가 저장되어있는 BufferView의 인덱스를 가리킨다.  
- **indices**: Sparse된 data의 인덱스가 저장되어있는 BufferView의 인덱스를 가리킨다.  
```json
"accessors": [
 {
	 "type": "SCALAR",
	 "componentType": 5126,  //GL_FLOAT
	 "count": 10,
	
	"sparse": {
		"count": 4,
		
		"valuew": {
			"bufferView": 2,
		},
		
		"indices": {
			"bufferView": 1,
			"componentType": 5123
		}
	},
 }
]
```
<img src="Docs/Pasted image 20240702161253.png" width="300">
  
그러니까 value array를 indices array를 통하여 access 하는 것이다.  

<br>

#### Complete Overview  
<img src="Docs/Pasted image 20240702143554.png" width="450">
  
위 사진에선 mesh primitive로 쓰이는 2D 텍스처 좌표를 접근하는 예시이다.    
**glBindBuffer**로   
**glVertexAttribPointer**  

<br>

glBindBuffer: 버퍼 객체를 현재 OpenGL 상태 컨텍스트에 바인딩하는 함수  
- 버퍼 객체는 GPU 메모리에 데이터를 저장하는 데 사용된다.  
- 이 함수를 사용하여 OpenGL이 특정한 유형의 버퍼 (array buffer, index buffer 등)에 접근할 수 있도록 설정한다.  
glVertexAttribPointer: 현재 바인딩된 버퍼에서 vertex 속성 데이터를 가져오는 방법을 OpenGL에 알려주는 함수  
- vertex 속성 데이터는 vertex array에서 vertex의 위치, 색상, 덱스처 좌표 등과 같은 정보를 의미한다.  
- 이 함수를 사용하여 GPU가 버퍼의 데이터를 해석하는 방법을 정의하는 데 사용된다.  

<br>

## 1.7 Materials  

<br>

각각의 Mesh는 glTF 에셋에 포함되어있는 **Meterials** 중 하나를 참조한다.    
**Meterial**은 오브젝트가 어떻게 렝더링 되어야 할 지 물리적 원리에 기반하여 표현한다.    
여기서 나오는 것이 **물리 기반 렌더링, PBR**이다. 이는 모든 Renderer에서 안정정으로 돌아가게 하도록 하기 위한 기법이다.    

<br>

#### Metallic-Roughness-Model  
<img src="Docs/Pasted image 20240703131025.png" width="300">
  
기본적으로 사용하는 Meterial Model은 Metallic-Roughness-Model이다.    
위 표에서 보는 것처럼, $`[0.0, 1.0] \times [0.0, 1.0]`$ 까지의 값으로 거칠기와 금속성을 표시한다.    
코드에서는 **pbrMetallicRoughness** 객체로 표현된다.    

<br>

#### Other Properties  
이제 코드를 살펴보며 다른 Properties도 알아보자.  
```json
"meterials": [
	{
		"pbrMetallicRoughness": {      // Metallic-Roughness-Model
			"baseColorTexture": {      // object main Texture
				"index": 1,
				"texCoord": 1
			}
		},
		"baseColorFactor":
			[1.0, 0.75, 0.35, 1.0],    // object main RGB color
		"metallicRoughnessTexture": {
			"index": 5,
			"texCoord": 1
		},
		"metallicFactor": 1.0,         // Metallic factor
		"roughnessFactor": 0.0,        // Roughness factor
	}
	"normalTexture": {        // Tangent-space normal inormation
		"scale": 0.8,
		"index":2,
		"texCoord": 1
	},
	"occlusionTexture": {    // define surface occluded from light
		"strength": 0.9,
		"index": 4,
		"texCoord": 1
	},
	"emissiveTexture": {    // define surface illuminate part
		"index": 3,
		"texCood": 1
	},
	"emissiveTactor":       // used to illuminate parts of surface
		[0.4, 0.8, 0.6]
]
```

<br>

#### Meterial Properties in Textures  
<img src="Docs/Pasted image 20240703135444.png" width="600">
  
Meterial에서도 마찬가지로 Textures를 참조할 때 인덱스로 참조한다.    
```json
"meshes": [
	{
		"primitives": [
			{
				"material": 2,
				"attributes": {
					"NORMAL": 3,
					"POSITION": 1,
					"TEXTCOORD_0": 2,
					"TEXTCOORD_1": 5
				},
			}
		]
	}
],
...
"materials": [
	...
	{
		"name": "brushed gold",
		"pbrMetallicRoughness": {
			"baseColorTexture": {
				"index": 1,
				"texCoord": 1  // TEXCOOR_<1>
			},
		},
		"metallicFactor": 1.0,
		"roughnessFactor": 1.0
	}
],
...
"textures": [
	...
	{
		"source": 4,
		"sampler": 2
	}
],
```

<br>

## 1.8 Textures, Images, Samplers  

<br>

**Textures**는 말그대로 텍스처에 대한 정보를 포함하고 있다. Image와 sampler의 인덱스를 지정한다.    
**Images** 이미지에 대한 정보를,    
**Samplers**는 텍스처들의 Wrapping 및 Scaling에 대해서 설명한다.    

<br>

```json
"textures": [
	{
		"source": 4,  // images에 대한 인덱스
		"sampler": 2  // samplers에 대한 인덱스
	}
	...
]
...
"images": [
	...
	{
		"uri": "file01.png"  // Location of Image file
	}
	{
		"bufferView": 3,
		"mimeType":
			"image/jpeg"     // Type of the Image
	}
],
...
"samplers": [  // OpenGL의 glTexPrameter() 함수 참고
	...
	{
		"magFilter": 9729,
		"minFilter": 9987,
		"wrapS": 10497,
		"wrapT": 10497
	}
],
```

<br>

## 1.9 Skins  

<br>

> **Rigging** involves creating a skeleton or a system of joints and controllers that allow you to animate the model  
  **Skinning** involves attaching the model's surface or mesh to the rig, so that it deforms properly when the rig moves.  

<br>

glTF에서 Skinning은 Rigging이 되어있다는 전제 하에 돌아가는 것 같다.    

<br>

#### Vertex Skinning  
> 모델을 구성하는 각각의 Vertex(정점)에 대해 그 정점이 어떤 Bone(뼈대)에 의해 영향을 받는지를 결정하고, 이 정보를 이용해 정점의 위치와 변형을 계산하는 기법  

<br>

따라서 Node는 **Mesh**도, **Skin**도 가리킬 수 있다.    

<br>

<img src="Docs/Pasted image 20240703190129.png" width="150">
  

<br>

다음은 위 그림의 구조를 나타낸 코드이다.  
```json
"nodes": [
	{
		"name":
			"Skinnes mesh node",
		"mesh": 0,  // 가리킬 Mesh의 인덱스
		"sking": 0  // 가리킬 Skin의 인텍스
	},
	...
	{
		"name": "Torso",
		"children":
			[2, 3, 4, 5, 6]
		"rotation": [...],
		"scale": [...],
		"translation": [...]
	},
	...
	{
		"name": "LegL",
		"children": [7],
		...
	}.
	...
	{
		"name": "FootL".
		...
	}.
	...
],
...
"meshes": [
	{
		"primitives": [
			{
				"attributes": {
					"POSITION": 0,
					"JOINTS_0": 1,  // 어떤 Joint가 Vertex에 영향을 미치는가
					"WEIGHTS_0": 2  // 얼마나 미치는가
					...
				}
			},
		]
	}
],
...
"skins": [
	{
		"inverseBindMatrices": 12,
		"joints": [1, 2, 3 ...]
	}
],
```

<br>

- **joints**: Skeleton 계층 구조를 정의하는 Node의 인덱스를 모아놓은 배열  
- Skeleton 계층 구조는 Node들에 의해 짜여진다.  
- 각각의 Joint는 Local Transform과 children 배열을 가질 수 있다.  
- "뼈"에 해당하는 부분은 암시적으로만 주어진다.  
- **inverseBindMatrices**: 각 joint에 대해 하나의 Matrix를 포함하는 Accessor에 대한 참조  
- 이 정보로부터 **Skinning Matrix**가 계산될 수 있다.  

<br>

여기서 잠깐, Local Transform과 Global Transform을 구분하고 가자.  
> **Local Transform**: 오브젝트의 자체 좌표계(LC)에서의 위치와 회전 `(내 기준 내 팔)`  
> **Global Transform**: 전체 World 좌표계(WC)에서 오브젝트의 위치와 회전 `(남이 보는 내 팔)`  

<br>

그럼 이제 Skinning Matrix가 어떻게 계산되는지 자세하게 살펴보자.  

<br>

### 1.9.1 Computing the Skinning Matrix  

<br>

먼저 사진으로 개념을 잡고가자면 다음과 같다.  
<img src="Docs/Pasted image 20240703191629.png" width="150">
<img src="Docs/Pasted image 20240703191648.png" width="192">
<img src="Docs/Pasted image 20240703191710.png" width="600">
  

<br>

#### Computing the Joint Matrices  
> `jointMatrix[j] = inverse(globalTransform) * globalJointTransform[j] * inverseBindMatrix[j];  
> 위쪽 사진까지 해당하는 과정  
- `inverseBindMatrix[j]`: Mesh를 Joint의 Local Space로 이동  
- `globalJointTransform[j]`: Joint를 꺾는다.  
- `inverse(globalTrnasform)`: 꺾인 부분에 해당하는 Mesh와 Skin의 Global Transform의 취소 `(및 부분에서 따로 계산 할거임)`  

<br>

#### Combining the Joint Matrices to Create the Skinning Matrix  
> `skinMatrix = a_weight.x * u_jointMatrix[int(a_joint.x)] + ... + a_weight.w * u_jointMatrix[int(a_joint.x)]`  
> 아래쪽 사진에 해당하는 과정  
- Skinned Mesh Component  
- POSITION  
- JOINT  
- WEIGHT  
- 위의 Accessor를 통한 데이터는 Vertex Shader에 `jointMatrix` 배열과 함께 전달된다.  
- Vertex Shader에서는 최종적으로 `skinMatrix`가 계산된다. 실제 Vertex Shader의 코드를 보자.  
```cpp
uniform mat4 u_jointMatrix[12];
attribute vec4 a_position;
attribute vec4 a_joint;
attribute vec4 a_weight;
...
void main(void) {
	...
	mat4 skinMatrix = 
		a_weight.x * u_jointMatrix[int(a_joint.x)] + 
		a_weight.y * u_jointMatrix[int(a_joint.y)] + 
		a_weight.z * u_jointMatrix[int(a_joint.z)] + 
		a_weight.w * u_jointMatrix[int(a_joint.w)];
	gl_Position = 
		modelViewProjection * skinMatrix * position;
}
```

<br>

## 1.10 Animations  

<br>

**Animation**에서는 Node의 Local Transform에 영향을 주어 물체를 움직일수도 있고,    
Morph Target의 Weight에 영향을 주어 물체에 변형을 일으킬 수도 있다.    

<br>

각각의 Animation은 다음과 같이 두 요소를 포함한다.  
- **channels**: Animation의 **target**을 지정한다. 보통 인덱스를 사용하여 Node를 참조한다.   
- **path**는 Animation의 유형이다.  
- `translation, rotation, scale` 는 Local transform을 위한 것이고, `weight`는 morph 타겟의 변형을 위한 것이다.  
- **samplers**: 구체적인 Animation 데이터를 요약한다.  
- **input**과 **output** 데이터를 참조하는데, Accesor의 인덱스를 이용애 그 데이터를 가져온다.  
- **input**에는 animation의 키프레임 시간 상수인 floating-point 값을,  
- **output**에서는 키프레임 시간에 따른 Animation property가 나온다.  
- **interpolation**: 애니메이션 보간 기법으로, 키프레임을 지정해두면 그 사이는 지정한 옵션에 따라 `LINEAR, STEP, CUBICSPLINE` 하게 보간한다.  
```json
"animations": [
	{
		"channels": [
			{
				"target": {
					"node": 1
					"path": "translation"
				},
				"sampler": 0
			}
		],
		"samplers": [
			{
				"input": 4,
				"interpolation": "LINEAR",
				"output": 5
			}
		]
	}
]
```

<br>

#### Animation Samplers  
<img src="Docs/Pasted image 20240704133344.png" width="600">
  
만약 키 프레임 시간이 0.8, 1.6이고 그 사이의 값인 1.2가 input으로 지정되었을 때,    
지정한 보간 법에 따라 Interpolation이 일어난다.  

<br>

#### Animation Channel Targets  
<img src="Docs/Pasted image 20240704133409.png" width="400">
  
<img src="Docs/Pasted image 20240704133423.png" width="400">
  
<img src="Docs/Pasted image 20240704133445.png" width="400">
  

<br>

## 1.11 Binary glTF Files  

<br>

먼저 glTF가 포함시킬 수 있는 External Binary Resource에 대해서 간략하게 알아보자.  
- Buffer: `.bin` 등, Geometry, Animation, Skins  
- Textures: `.png, .dds(extention 필요)` 등, Textures  
glTF에서 External Binary Resource를 포함시킬 때 두 가지 옵션이 존재한다. (사실 1.2 Concepts에서 설명 됐다.)  
- Referenced via URIs: URI로 참조하는 방법  
- Embedded as data URIs: 그냥 Data를 JSON 파일에 쌩으로 집어넣는 방법, JSON 파일 크기가 상당히 증가한다.  

<br>

위 두 옵션을 보완하고자 제안된 것이 `.glb`, 즉, **연관된 모든 파일을 합쳐 하나의 Binary File로 만드는 것이다.**    
이 파일은 Little-Endian 형식이고, 다음과 같은 요소를 포함한다.  
- **header**: 버전과 데이터 구조 증 기본 정보 제공  
- **chunks**: 실제 데이터 포함, 첫번째 chunk는 항상 JSON 데이터이다.  
자세한 구조는 밑의 그림의 설명을 찬찬히 읽어보면 쉽게 이해될 것이다.  
<img src="Docs/Pasted image 20240704134859.png">
  

<br>

## 1.12 Extensions  

<br>

glTF에는 여러 함수를 추가할 수 있는 **Extension**들이 존재한다.   
- **extensionsUsed**: 쓰인 Extension들  
- **extensionsRequired**: Asset을 로드하는 데 엄격하게 필요한 Extension들  
```json
"extensionsUsed": [
	"KHR_lights_common",
	"CUSTOM_EXTENSION"
]

"extensionsRequired": [
	"KHR_lights_common"
]
...// Extension 사용 예시
"textures": [
	{
		...
		"extensions": {
			"KHR_lights_common": {
				"lightSource": true,
			},
			"CUSTOM_EXTESNION": {
				"customProperty":
					"customValue"
			}
		}
	}
]
```

<br>

다음은 현재 존재하는 Extension들이다.  
<img src="Docs/Pasted image 20240704140518.png">
  
Draco로 압축하거나,    
Point Light, Spot light, Directional Light를 지원하고나,  
<img src="https://www.kitware.com/main/wp-content/uploads/2021/01/carbonComp0-1024x508.png" width="200">
 (PBR objext Clear Coating)    
투명한 물체의 굴절률을 확장하던가,    
색상이 시야각에 따라 달라지는 박막효과 모델링이라던가,    
천섬유로 인한 후방산란에 대한 색상 파라미터를 추가하거나,    
Specular 반사 파라미터에 색상과 강도를 추가하던가,    
<img src="https://www.khronos.org/assets/uploads/apis/Universal-GPU-Compressed-Textures.png" width="400">
 (KTX v2)  
<img src="http://wiki.polycount.com/w/images/thumb/1/15/Stefan-Morrell_modular-texture.jpg/450px-Stefan-Morrell_modular-texture.jpg" width="400">
 (Texture Atlases)  
등등...  
어쨌든 뭐 여러가지 기능이 존재하는 것 같다.  

<br>

전체 리스트는 다음 사이트에서 확인 가능하다.  
[glTF/extensions/2.0 at main · KhronosGroup/glTF (github.com)](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0)  

<br>

# glTF Tutorial  

<br>

## 6. Simple Amination  

<br>

```json
{
  "scene": 0,
  "scenes" : [
    {
      "nodes" : [ 0 ]
    }
  ],
  
  "nodes" : [
    {
      "mesh" : 0,
      "rotation" : [ 0.0, 0.0, 0.0, 1.0 ]  // 0º 만큼 회전해라 (원 상태태)
    }
  ],
  
  "meshes" : [
    {
      "primitives" : [ {
        "attributes" : {
          "POSITION" : 1
        },
        "indices" : 0
      } ]
    }
  ],
  
  "animations": [
    {
      "samplers" : [
        {
          "input" : 2,
          "interpolation" : "LINEAR",
          "output" : 3
        }
      ],
      "channels" : [ {
        "sampler" : 0,
        "target" : {
          "node" : 0,
          "path" : "rotation"
        }
      } ]
    }
  ],

  "buffers" : [
    {
      "uri" : "data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=",
      "byteLength" : 44
    },
    {
      "uri" : "data:application/octet-stream;base64,AAAAAAAAgD4AAAA/AABAPwAAgD8AAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAD0/TQ/9P00PwAAAAAAAAAAAACAPwAAAAAAAAAAAAAAAPT9ND/0/TS/AAAAAAAAAAAAAAAAAACAPw==",
      "byteLength" : 100
    }
  ],
  "bufferViews" : [
    {
      "buffer" : 0,
      "byteOffset" : 0,
      "byteLength" : 6,
      "target" : 34963
    },
    {
      "buffer" : 0,
      "byteOffset" : 8,
      "byteLength" : 36,
      "target" : 34962
    },
    {
      "buffer" : 1,
      "byteOffset" : 0,
      "byteLength" : 100
    }
  ],
  "accessors" : [
    {
      "bufferView" : 0,
      "byteOffset" : 0,
      "componentType" : 5123,
      "count" : 3,
      "type" : "SCALAR",
      "max" : [ 2 ],
      "min" : [ 0 ]
    },
    {
      "bufferView" : 1,
      "byteOffset" : 0,
      "componentType" : 5126,
      "count" : 3,
      "type" : "VEC3",
      "max" : [ 1.0, 1.0, 0.0 ],
      "min" : [ 0.0, 0.0, 0.0 ]
    },
    {
      "bufferView" : 2,
      "byteOffset" : 0,
      "componentType" : 5126,  // 키 프레임의 시간 타입: float 형 상수 값
      "count" : 5,  // 키 프레임의 수: 5개
      "type" : "SCALAR",  // 
      "max" : [ 1.0 ],
      "min" : [ 0.0 ]
    },
    {
      "bufferView" : 2,
      "byteOffset" : 20,  // input의 정보: 4 byte(float) * 5 = 20
      "componentType" : 5126,
      "count" : 5,  // 4 byte(float) * 4(VEC4) * 5 = 80
      "type" : "VEC4",
      "max" : [ 0.0, 0.0, 1.0, 1.0 ],
      "min" : [ 0.0, 0.0, 0.0, -0.707 ]
    }
  ],
  
  "asset" : {
    "version" : "2.0"
  }
  
}
```

<br>

실제로 Aminmation에서 읽어들이는 값을 표로 나타내면 다음과 같다.  

<br>

| times accessor |  **rotations accessor**   |               Meaning               |  
| :------------: | :-----------------------: | :---------------------------------: |  
|      0.0       |   (0.0, 0.0, 0.0, 1.0 )   |           0.0s / 0º 만큼 회전           |  
|      0.25      | (0.0, 0.0, 0.707, 0.707)  |     0.25s / z축을 중심으로 90º 만큼 회전      |  
|      0.5       |   (0.0, 0.0, 1.0, 0.0)    |     0.5s / z축을 중심으로 180º 만큼 회전      |  
|      0.75      | (0.0, 0.0, 0.707, -0.707) | 0.75s / z축을 중심으로 270º (= -90º)만큼 회전 |  
|      1.0       |   (0.0, 0.0, 0.0, 1.0)    |  1.0s / z축을 중심으로 360º (= 0º)만큼 회전   |  

<br>


<br>

#### gltf: Scale, Transform, Rotation  
> Scale, Transform은 단순히 `[x, y, z]` 방향으로 Scale/Transform 되지만,  
> Rotation은 **Quaternion(사원수)** method를 써서 어떻게 회전할지를 표현한다.  

<br>

**Scale, Transform**  
- 직관적으로 쉽게 이해할 수 있기에 넘어가겠다.  

<br>

**Rotation**  
- **Quaternion**은 회전을 나타내기 위해 사용되는 수학적인 도구이다.  
- 구성:  
- $`q = w + xi + yj + zk`$  
- $`w, x, y, z`$: Quaternion의 구성 요소  
- $`i, j, k`$: 단위 허수  
- 표기:  
- $`q = (x, y, z, w) = \text{gltf: [x, y, z, w]}`$  
- 해석:  
- $`q = (x, y, z, w) = (v_x\sin\frac{\theta}{2}, v_y\sin\frac{\theta}{2}, v_z\sin\frac{\theta}{2}, \cos\frac{\theta}{2})`$  
- $`(v_x, v_y, v_z)`$: 회전 축의 방향 벡터, 단위 벡터이다.  
- $`\theta`$: 회전 각도  
- 예제: $`\text{[0.0, 0.0, 0.707, 0.707]}`$  
- $`w = 0.707 = \cos\frac{\theta}{2} = \cos\frac{90\degree}{2} = \sin\frac{90\degree}{2}`$  
- $`(x, y, z, w) = (0.0, 0.0, 0.707, 0.707) = (0.0 \times 0.707, 0.0 \times 0.707, 1.0 \times 0.707, \cos\frac{90\degree}{2})`$  
- $`(v_x, v_y, v_z) = (0.0, 0.0, 1.0)`$: z축  

<br>

## 7. Animation  

<br>

```json
  "animations": [
    {
      "samplers" : [
        {
          "input" : 2,
          "interpolation" : "LINEAR",
          "output" : 3
        },
        {
          "input" : 2,
          "interpolation" : "LINEAR",
          "output" : 4
        }
      ],
      "channels" : [ 
        {
          "sampler" : 0,
          "target" : {
            "node" : 0,
            "path" : "rotation"
          }
        },
        {
          "sampler" : 1,
          "target" : {
            "node" : 0,
            "path" : "translation"
          }
        } 
      ]
    }
  ],
```

<br>
