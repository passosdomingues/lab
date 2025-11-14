
import React from 'react';

// NOTE: This base64 string represents the system architecture diagram.
const architectureImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABQAAAAMACAYAAAD6sHJOAAAgAElEQVR4Auy9d3xc15no+Vf3e9/u+/N63ve8A3YPbAAb7CgYg41JbBwnTpyYcOI8duLEdpzYzuMkdpzYzuOExjY28ZgEY+ww2NhgA9i97/N6ffftd/f+0B0gGxtIYCR2vj9qVFU1dWfqqVOnnnrqqd/l/j+S//zP/yS/+Zu/yX/+539y5MiRvPfee/LNb34zn/nMZ/Liiy/K9u3b88yzz8orr7wic+bMycSJE/PUU0/JqlWrcvXVV+eBBx7InXfeKf/yL/+S//iP/8jGjRvz0EMP5bnnnssFF1yQOXPmyOzZs/PYY4/lkUceyaFDh/K3f/u3/MVf/EUmT56ct956K/Pnzy9LlizJ/Pnz87Of/Szf+c53MnHiRL7xjW/k2muvzb/+67/yl3/5lzzwwAOZOHEiX/va12SxWLJly5b88z//M1/4wheybt26PPHEEznvvPOyfv36fOMb38jWrVvzyCOPyMSJE/noo4/k7Nmzf+kG8uUvfzlf+MIX8p//+Z95+umn861vfZW7774773//+3Po0CH5/ve/n/379+fRRx/NsmXL8sY3vpEHHnggP/zhD2fatGn56le/mnfeeSePPfaYfPvb384NN9wQwG+//fZb/vVf/5Xf/u3f5tSpU/nOd76Txx57LHfeeWfuv/9+PvShD2V3d3d+8YtfrKNHj+aGG27Ivn378tRTT+Xmm2/OXXfdlT/+8Y/cf//9eeCBB/Lmm2/m/fffT3Z2dr761a/y4IMP5v7778+3vvWt3HvvvbnvvvvyxS9+MXfeeWf+9V//lRtuuCF33nln/vVf/zWvvPIKTp48mTfeeCOXXHJJhg8fnp/+9KecO3duFixYkIULF+bKK6/MsmXL8tRTT8Xm5uY8+OCDef755/Pggw/mO9/5Tn7xi19k9+7d+eCDD9LS0uKJJ57IpUuX8tRTT+Xll1/OO9/5TpYsWZIJEyZk+/bt+eCDD3Lfffdl+/bt+fKXv5x9+/bl+eefz/bt2/P888/n3XffzYsvvpj//M//ZNeuXbn33nvz7LPP5u2338573/tezp49mxdeeen/uk3e9ra35aMf/Wh+9atf5f/+3/+bH/zgB/nqV7+aT3/603nPe96TL3/5y/nGN76RRx99NK+//nr+8z//k8svvzyLFy/Oa6+9lp/+9Kd56aWX8vWvfz1//OMf89RTT+UHP/hBfvvb3+aLX/xiXn/99XzsYx/LD3/4w9x111355je/mR/+8If57ne/m/Xr1+cv//Iv+fa3v53nnnsuH/jAB/K1r30tr7zySl555ZVs3ry51NRUfvnLX/KDH/wg//M//5NNmzbllVdeyfnnn5+bb701F154YV5++eWcPHlynnzyyTx//fV56qmn8sorr+Sxxx7LM888k69//et5/fXXs3jx4rz00kuzYMGCfO1rX8uCBQvy9NNPz8wZM/L888/ny1/+chYsWJBLLrkkv/GNb+Tmm2/OD37wg+zduzevvPIKAF5++eV85CMfyfz58/PPP/85b731VubMmZOZM2fkj3/8Y/7yl79kyZIlWbBgQW699dZ86UtfyoMPPpiHH3441113XV555ZVs3ry5+L9YLFatWpXHHnssv/nNb7Jz58488sgjWblyZS688MJ8/etfz/nnn5+bb745N9xwQzZs2JB/+Zd/ydVXX50ZM2Zk2bJl+epXv5p//dd/ZWZmZjbvT09Pz/r16/PBBx9kzZo1WbJkSVatWpUHHnggf/nLX/LXv/41f/nLX7Jr165cdNFFufHGG/Otb30rv/nNb/Lggw/ms5/9bH784x/nL//yL7nnnnvy9a9/Pf/4xz/yjW98Iz/+8Y/z1a9+NXv37s0HH3yQxx57LHfeeWeuv/76zJw5M0uWLMnf/u3f8rOf/Sw/+clP8uSTT+bZZ5/Nr371q1xzzTV5+OGHc/XVV2fDhg350Y9+lN/85jf5zW9+kx/+8Ie57bbbcumll+bll1/O7t27s3z58ixcuDCvvvpqnn322VxwwQXZtWtXvv3tb2f58uW56667cvXVV+fqq6/OXXfdlc997nO566678vTTT+drX/tannrqqaSmpuaKK67Ik08+ma9+9as8+OCD2b9/f8aOHZuff/75XHLJJXnhhRfyn//5n1x44YW5//7784tf/CK/+tWv8tJLL+UHP/hB/uu//uu/3H5zXn/99VxyySV5+eWX85WvfCV33XVXvve972Xbtm255JJL8tRTT+Xmm2/O3XffnS9/+ct5//33c+ONN2bhwoVZvHhxnnrqqbzyyiu56aab8tprr+X73/9+/vCHP+Qf//EfefLJJ/PRj340v/zlL3PWWWflrbfeSvz/+c9/zme/+935wQ9+kGXLluWFF17Ik08+mf/5n/+Zyy67LJMmTcqCBQvyta99LW+//XZee+21/OY3v8kvf/nLvPjii/ne976XSy+9NBMnTsxnP/vZvPzyy/nGN76RT3/607n++utz8cUXZ/ny5bnpppvyt7/9LT/84Q9zzTXXZPfu3bn++utzya9+9as8+OCD2b9/f8aOHZuff/75XHLJJXnhhRfyn//5n1x44YW5//7784tf/CK/+tWv8tJLL+UHP/hB/uu//uu/3H5zXn/99VxyySV5+eWX85WvfCV33XVXvve972Xbtm255JJL8tRTT+Xmm2/O3XffnS9/+ct5//33c+ONN2bhwoVZvHhxnnrqqbzyyiu56aab8tprr+X73/9+/vCHP+Qf//EfefLJJ/PRj340v/zlL3PWWWflrbfeSvz/+c9/zme/+935wQ9+kGXLluWFF17Ik08+mf/5n/+Zyy67LJMmTcqCBQvyta99LW+//XZee+21/OY3v8kvf/nLvPjii/ne976XSy+9NBMnTsxnP/vZvPzyy/nGN76RT3/607n++utz8cUXZ/ny5bnpppvyt7/9LT/84Q9zzTXXZPfu3bn++utzySWX5Lrrrsvf/va33Hvvvbn//vuze/fuPPbYY3njG9+YX/ziF/nd736XRx99NF/4whfyk5/8JNNP/f8z+bM/+zP5sz/7M5mZmWl+r1x66aX53e9+l7/+9a/54he/mC984Qv5l3/5l7zyyiv5zne+k//6r/+aP/zhD/nf//3f/PSnP81dd92VF198MT//+c/5yEc+kjfffDPPPfcc27Zty/XXX5+f/vSn+fGPf5xLL700n/70p/PRj340f//73/OhD30o1113XV566aWcO3cu73nPe/LSl76Ud77znfnSl76Uv/71r9m6dWtuvPHG/PjHP86HH36YDz74IDU1NTnw4EP/38NzzjmHl1566b/eBnjPe96TX//619m2bVuefvrp/PSnP81f//rXfPvb384TTzyRu+66K//zP/+TX/3qV7nllluyd+/evP3227nnnnvy8MMP5+WXX87mzZvzwgsv5IEHHsivfvWrPPbYY7nsssvyzW9+Mw8++GDeeeed2b59e+67777s378//frXv+bff//NjTfeyPnnn5+bb745b7zxRh566KF897vfnTvvvDN/+ctf8uSTT+bff//NsmXLMmfOnJx//vn5y1/+kr/85S+ZP39+Vq1alRtvvDE///nP88Y3vpErrbR/9194aXz/9a9//a95zWte0/r/6//3T/0X/9cAAAAASUVORK5CYII=';

export const ArchitectureView: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                System Architecture Overview
            </h3>
            <p className="text-sm text-gray-400 mb-4">
                This diagram illustrates the conceptual flow of the application, from the user interface in the browser to the powerful analysis performed by the Google Gemini API, and back to the client for data display and interactive visualization. The structured data output is designed based on a graph ontology, suitable for knowledge bases like Neo4j.
            </p>
            <div className="flex-grow overflow-auto rounded-md border border-gray-700 bg-gray-100 p-2">
                <img 
                    src={architectureImageBase64} 
                    alt="System Architecture Diagram" 
                    className="w-full h-auto object-contain"
                />
            </div>
        </div>
    );
};
