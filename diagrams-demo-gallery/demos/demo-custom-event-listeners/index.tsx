import { useEffect, useState } from 'react';
import * as React from 'react';
import createEngine, {
	DefaultNodeModel,
	DiagramModel, NodeModel
} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

function useEngineWithCustomHandlers(eventHandlers: {
	onAdd?: (node: NodeModel) => void;
}) {
	const [engine, setEngine] = useState(() => {
		const _engine = createEngine();
		const _model = new DiagramModel();
		_engine.setModel(_model);
		return _engine;
	});

	useEffect(() => {
		const handlers = {
			nodesUpdated: event => {
				if (event.isCreated) {
					eventHandlers?.onAdd(event.node);
				}
			}
		};
		const { deregister } = engine.getModel().registerListener(handlers);
		return deregister;
	}, [engine.getModel(), eventHandlers]);

	return engine;
}

export default () => {
	const [caughtEvents, setCaughtEvents] = useState([]);

	const engine = useEngineWithCustomHandlers({
		onAdd: node => setCaughtEvents(prev => [...prev, `New node with id '${node.getID()}' is added`]),
	});

	const addNode = () => {
		const nodeName = prompt('name of node?');
		const node = new DefaultNodeModel(nodeName, 'green');
		node.setPosition(250, 250);
		engine.getModel().addNode(node);
		engine.repaintCanvas();
	};

	const addManyNodes = () => {
		const nodeName1 = prompt('name of node 1?');
		const node1 = new DefaultNodeModel(nodeName1, 'blue');
		node1.addInPort('IN');
		node1.setPosition(250, 250);
		const nodeName2 = prompt('name of node 2?');
		const node2 = new DefaultNodeModel(nodeName2, 'red');
		node2.addOutPort('OUT');
		node2.setPosition(350, 250);
		engine.getModel().addAll(node1, node2);
		engine.repaintCanvas();
	};

	return (
		<DemoCanvasWidget>
			{engine.getModel() && <CanvasWidget engine={engine} />}
			<div style={{ maxWidth: 200, color: 'white' }}>
				<b>Controls</b>
				<br /><br />
				<button onClick={addNode}>Add node</button><br/>
				<button onClick={addManyNodes}>Add 2 nodes</button><br/>
			</div>
			<div style={{ maxWidth: 200, color: 'white' }}>
				<b>Events</b>
				<br /><br />
				<ul>
					{
						caughtEvents.map((evt, i) => (
							<li key={i}>{evt}</li>
						))
					}
				</ul>
			</div>
		</DemoCanvasWidget>
	);
};
