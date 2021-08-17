pragma solidity^0.8.4;
import './interfaces/ILiquidityValueCalculator.sol';
import '@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract LiquidityValueCalculator is ILiquidityValueCalculator {
    address public factory;
    IUniswapV2Router02 router;
    constructor(address factory_,address _router) public {
        factory = factory_;
        router = IUniswapV2Router02(_router);
    }
    function pairInfo(address tokenA, address tokenB) internal view returns(uint reserveA, uint reserveB, uint totalSupply){
        IUniswapV2Pair pair = IUniswapV2Pair(UniswapV2Library.pairFor(factory, tokenA, tokenB));
        totalSupply = pair.totalSupply();
        (uint reserves0, uint reserves1,) = pair.getReserves();
        (reserveA, reserveB) = tokenA == pair.token0() ? (reserves0, reserves1) : (reserves1, reserves0);
    }
    function swapByme(uint amountOutMin){
        uint amountIn = 50 * 10 ** DAI.decimals();
        require(DAI.transferFrom(msg.sender, address(this), amountIn), 'transferFrom failed.');
        require(DAI.approve(address(UniswapV2Router02), amountIn), 'approve failed.');
        address[] memory path = new address[](2);
        path[0] = address(DAI);
        path[1] = UniswapV2Router02.WETH();
        router.swapExactTokensForETH(amountIn, amountOutMin, path, msg.sender, block.timestamp);
    }
    function addLiquidity(address tokenA, address tokenB, uint amountA, uint amountB, uint tolPercentage) public{
        uint amountAMin = (amountA - amountA * tolPercentage);
        uint amountBMin = (amountB - amountB * tolPercentage);
        require(IERC20(tokenA).transferFrom(msg.sender, address(this), amountA), "My: transferFrom failed.");
        require(IERC20(tokenB).transferFrom(msg.sender, address(this), amountB), "My: transferFrom failed.");
        require(IERC20(tokenA).approve(address(router), amountA), "My: Approve Failed.");
        require(IERC20(tokenB).approve(address(router), amountB), "My: Approve Failed.");
        router.addLiquidity(tokenA,tokenB, amountA,amountB, amountAMin, amountBMin,msg.sender,block.timestamp);
    }
    function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint tolPercentage, uint decimals) public{
         IUniswapV2Pair pair = IUniswapV2Pair(UniswapV2Library.pairFor(factory, tokenA, tokenB));       
         require(IUniswapV2Pair(pair).transferFrom(msg.sender, address(this), liquidity), "My: transferFrom failed.");
        require(IUniswapV2Pair(pair).approve(address(routerContract), liquidity), "My: Approve Failed.");
        router.removeLiquidity(tokenA, tokenB, liquidity, 0, 0,msg.sender,block.timestamp);
    }
}